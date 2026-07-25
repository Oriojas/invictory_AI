import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { addToQueue, getAll, updateItem, removeItem } from "./queueDB.js";
import { captureAudio, captureImage, isNetworkError } from "../api.js";

const QueueContext = createContext(null);
export const useQueue = () => useContext(QueueContext);

// Estado compartido de la cola offline: conexión, ítems pendientes, encolar y sincronizar.
export function QueueProvider({ children }) {
  const [items, setItems] = useState([]);
  const [online, setOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [syncedTick, setSyncedTick] = useState(0); // sube al procesar con éxito → refresca Home/Alertas
  const syncingRef = useRef(false);

  const reload = useCallback(async () => {
    setItems(await getAll());
  }, []);

  useEffect(() => {
    reload();
    // Pide almacenamiento persistente (reduce evicción). No garantizado en todos los webviews.
    navigator.storage?.persist?.().catch(() => {});
  }, [reload]);

  const enqueue = useCallback(
    async (media) => {
      const item = {
        id: crypto.randomUUID(),
        tipo: media.tipo, // 'audio' | 'imagen'
        blob: media.blob,
        filename: media.filename,
        createdAt: Date.now(),
        estado: "pendiente",
        intentos: 0,
        lastError: null,
      };
      await addToQueue(item);
      await reload();
      return item;
    },
    [reload]
  );

  const sendOne = useCallback((item) => {
    if (item.tipo === "audio") return captureAudio(item.blob, item.filename);
    const file = new File([item.blob], item.filename, { type: item.blob.type || "image/jpeg" });
    return captureImage(file);
  }, []);

  const sync = useCallback(async () => {
    if (syncingRef.current || !navigator.onLine) return;
    syncingRef.current = true;
    setSyncing(true);
    let anySuccess = false;
    try {
      const pendientes = (await getAll()).filter((i) => i.estado !== "enviando");
      for (const item of pendientes) {
        await updateItem(item.id, { estado: "enviando" });
        await reload();
        try {
          await sendOne(item);
          await removeItem(item.id); // procesado (el backend ya lo persiste)
          anySuccess = true;
        } catch (err) {
          if (isNetworkError(err)) {
            // Se cayó la red a mitad: dejar pendiente y parar el barrido.
            await updateItem(item.id, { estado: "pendiente" });
            break;
          }
          await updateItem(item.id, {
            estado: "error",
            intentos: (item.intentos || 0) + 1,
            lastError: String(err?.message || err),
          });
        }
        await reload();
      }
    } finally {
      syncingRef.current = false;
      setSyncing(false);
      await reload();
      if (anySuccess) setSyncedTick((t) => t + 1);
    }
  }, [reload, sendOne]);

  // Escucha cambios de conexión y auto-sincroniza al volver la red.
  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      sync();
    };
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [sync]);

  // Al abrir/reabrir la app: si hay pendientes y hay red, procesar.
  useEffect(() => {
    if (navigator.onLine && items.some((i) => i.estado !== "enviando")) sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const removeQueued = useCallback(
    async (id) => {
      await removeItem(id);
      await reload();
    },
    [reload]
  );

  return (
    <QueueContext.Provider
      value={{
        items,
        pendingCount: items.length,
        online,
        syncing,
        syncedTick,
        enqueue,
        sync,
        removeQueued,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}
