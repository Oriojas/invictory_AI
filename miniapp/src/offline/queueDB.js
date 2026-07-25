// Cola de capturas offline en IndexedDB (guarda Blobs y persiste al cerrar la app).
// localStorage no sirve: solo texto y ~5MB. Aquí guardamos audio/imágenes crudos.
const DB_NAME = "invictory_offline";
const DB_VERSION = 1;
const STORE = "captures";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function store(db, mode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

function done(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addToQueue(item) {
  const db = await openDB();
  await done(store(db, "readwrite").add(item));
  return item;
}

export async function getAll() {
  const db = await openDB();
  const items = (await done(store(db, "readonly").getAll())) || [];
  // Orden estable por antigüedad (FIFO).
  return items.sort((a, b) => a.createdAt - b.createdAt);
}

export async function updateItem(id, patch) {
  const db = await openDB();
  const s = store(db, "readwrite");
  const current = await done(s.get(id));
  if (!current) return null;
  const next = { ...current, ...patch };
  await done(s.put(next));
  return next;
}

export async function removeItem(id) {
  const db = await openDB();
  await done(store(db, "readwrite").delete(id));
}

export async function count() {
  const db = await openDB();
  return done(store(db, "readonly").count());
}
