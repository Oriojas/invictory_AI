# INVICTORY_AI × COLSUBSIDIO & 30X
## Manual Operativo de Adopción
### Sistema de Control Inteligente de Inventarios — Invictory_AI

> **Código**: `MNL-OPS-COL-2026-V2` | **Clasificación**: `CONFIDENCIAL · USO INTERNO OPERATIVO` | **Vigencia**: `2026–2027`

Este manual establece los protocolos de adopción y ejecución en campo para el personal operativo, auditores y directivos de Colsubsidio. Cubre desde la captura de inventarios mediante voz y fotografía hasta la generación de reportes certificados, garantizando trazabilidad total y eliminación de procesos manuales en papel.

---

## MÓDULO 1 · CONTEXTO, SOLUCIÓN E IMPACTO

### 1.1 Problemática Operativa en Almacenes Colsubsidio
En las operaciones de hotelería, Alimentos & Bebidas (A&B) y supermercados de Colsubsidio, la toma física de inventarios ha dependido históricamente de **planillas en papel**. Este método genera tres cuellos de botella críticos:

- ⏱ **Ineficiencia de Tiempo**: Hasta **6 horas por jornada** dedicadas al llenado de hojas y posterior digitación manual en el ERP, desviando al personal de sus funciones productivas.
- ⚠️ **Errores de Transcripción**: Transcripción errónea de cantidades y confusión entre nombres locales (*"ollas grandes"*) y el SKU oficial (*"Caldero Recort Tapa 50x60 cm"*).
- 📉 **Mermas Invisibles**: Los descuadres financieros se detectan **días después**, cuando ya no es posible auditar la fuga o el error en bodega.

### 1.2 La Solución Invictory_AI: Arquitectura de Campo
Invictory_AI es una plataforma de toma inteligente de inventarios que habilita al personal de campo para registrar existencias mediante **dictado por voz o fotografía** desde la Telegram Mini App, realizando una auditoría automática en tiempo real antes de guardar el conteo.

```text
[1. Operario en Bodega] ➔ [2. Dictado de Voz / Foto] ➔ [3. Motor IA (STT + Vision OCR)] ➔ [4. Traducción SKU ERP] ➔ [5. Decisión: Alerta / Guardado] ➔ [6. Dashboard & PDF]
```

*El flujo garantiza que cada conteo sea verificado contra el stock teórico del ERP antes de ser confirmado, eliminando errores antes de que impacten los estados financieros.*

### 1.3 Indicadores Clave de Impacto Operativo
- **-80% Reducción de Tiempo**: Pases de inventario completados en minutos, frente a las 6 horas del proceso manual tradicional.
- **0% Hojas de Papel**: Digitalización nativa directa en el punto de almacenamiento, sin registros físicos intermedios.
- **100% Auditoría Preventiva**: Bloqueo de descuadres antes de impactar los estados financieros de la organización.

*Estos indicadores son medibles desde el Dashboard Ejecutivo en tiempo real y se actualizan con cada jornada de conteo completada.*

---

## MÓDULO 2 · PROTOCOLOS PARA EL OPERARIO DE BODEGA

### 2.1 Protocolo de Campo: Captura Multimodal
- **Perfil Target**: Almacenistas, auxiliares de bodega, chefs ejecutivos y personal de inventario en sedes hoteleras y de consumo.
- **Herramienta**: Dispositivo móvil o tablet corporativa con Telegram Mini App.

#### ✅ Preparación Previa (Checklist)
- Verificar carga de batería del dispositivo (mínimo 30%).
- Abrir el bot oficial de `Invictory_AI` en Telegram y pulsar **"Abrir Mini App"**.
- Seleccionar el centro de trabajo correcto (ej. *"Hotel Peñalisa - Bodega A&B"*).

#### 🎙️ Dictado por Voz (Método Preferido)
1. Posiciónate frente al estante o zona de insumos.
2. Mantén presionado el botón central de dictado (amarillo Colsubsidio).
3. Pronuncia con voz clara: `[Cantidad] + [Unidad] + [Insumo]`
   - *Ejemplo: "14 cajas de aceite de oliva de 1 litro"*
4. Suelta el botón y revisa la transcripción en menos de 2 segundos.

#### 📷 Captura por Foto / OCR
1. Presiona **"Capturar Foto"** y enfoca la etiqueta del empaque.
2. La IA procesará el código, lote o texto visible y autocompletará el conteo.

### 2.2 Protocolo ante Alertas de Discrepancia
Si el conteo dictado o fotografiado difiere del inventario teórico registrado en el sistema, la Mini App activará una **Alerta Preventiva de Descuadre**.

```text
[Registro Conteo] ➔ [Comparación ERP] ➔ [Sin Diferencia: Registrado Exitosamente] / [Con Diferencia: Alerta y Reconteo Físico]
```

- **Confirmar Conteo Real**: Si el conteo inicial era correcto en estante, pulsa este botón para registrar el valor real con motivo justificado.
- **Re-contar**: Si el conteo inicial fue erróneo, repite el dictado o captura fotográfica para corregir el registro antes de guardar.

---

## MÓDULO 3 · AUDITORÍA INTERNA Y REPORTES

### 3.1 Control de Mermas y Conciliación Semántica
- **Perfil Target**: Auditores de contraloría, analistas de inventario y coordinadores de mermas.
- **Certeza de la IA**: Niveles de certeza superiores al 97%.

| Frase Dictada por Operario | Traducción Semántica IA | SKU ERP Oficial | Certeza |
| :--- | :--- | :--- | :---: |
| *"Ollas grandes de aluminio"* | Caldero Recort Tapa 50x60 cm | `SKU-8842` | 99.4% |
| *"Cajas de aceite vegetal"* | Aceite Vegetal Bidón 20 L | `SKU-1024` | 98.8% |
| *"Botella de ron a la mitad"* | Ron Viejo 750ml (Fracción 0.50) | `SKU-3319` | 97.5% |

#### Niveles de Severidad:
- 🔴 **Severidad Alta**: Diferencia > $500.000 COP o > 20% unidades. Requiere aprobación explícita de Auditoría.
- 🟡 **Severidad Media**: Diferencia entre $50.000 y $500.000 COP. Revisión en lote al final del turno.
- 🟢 **Severidad Baja**: Diferencias menores de empaque o mermas normales. Ajuste automático programado.

### 3.2 Generación de Reportes PDF Certificados
El módulo de reportes certificados permite a los auditores generar informes con validez formal para presentaciones directivas, auditorías externas y archivos de contraloría.

#### Pasos para Exportar:
1. Accede al módulo **Tabla de Discrepancias** en el Dashboard.
2. Aplica los filtros por sede, fecha y rango de bodegas.
3. Haz clic en **"Exportar Reporte Certificado PDF"**.
4. El informe incluirá membrete Colsubsidio, sello de tiempo digital y desglose de ítems auditados.

*Los reportes PDF incluyen firmas digitales de responsabilidad y son válidos para auditorías internas y externas sin necesidad de validación adicional.*

---

## MÓDULO 4 · GERENCIA EJECUTIVA

### 4.1 Cuadro de Mando Ejecutivo y Asistente IA
- **Perfil Target**: Directores de sede hotelera, gerentes de A&B y directores operativos.

#### Indicadores Bento Grid:
- **Stock Total Registrado**: Volumen consolidado valorizado de todas las bodegas activas en tiempo real.
- **Descuadres Prevenidos**: Valorización en dinero de las mermas contenidas antes de guardar el conteo.
- **Coincidencia Semántica**: % de precisión en la traducción del lenguaje natural al catálogo ERP oficial.
- **Ahorro en Auditoría**: Comparativa de eficiencia (reducción de 6 horas a 45 minutos por conteo).

#### Ejemplos de Prompt para el Asistente IA:
- *"¿Cuáles son los 5 productos con mayor tasa de descuadre en el Hotel Peñalisa?"*
- *"Compara el cumplimiento de conteo entre Bodega Central y Cocina Principal."*
- *"Dame existencias de licores de alta gama y alerta diferencias superiores al 5%."*

---

## MÓDULO 5 · CONTINGENCIAS & EVALUACIÓN

### 5.1 Modo Offline (Sin Cobertura)
En bodegas subterráneas o cavas con baja señal de red:
1. El operario continúa dictando y capturando fotos sin conexión.
2. Los audios e imágenes se almacenan en una **cola local segura del dispositivo**, sin procesamiento local.
3. Al recuperar señal, la app sincroniza automáticamente la cola completa al servidor.
4. El servidor procesa cada audio e imagen en orden y devuelve los SKU traducidos.
5. El operario recibe confirmación de cada ítem procesado en el Dashboard.

**Garantías Operativas**: Cero pérdida de datos gracias al búfer seguro, procesamiento garantizado cuando hay conexión, orden de conteo preservado y auditoría completa de qué se capturó y cuándo se procesó.

### 5.2 Checklist Evaluación Piloto / JAM
- [ ] Tiempo de dictado por ítem menor a 4 segundos.
- [ ] Traducción semántica correcta del 95% de expresiones.
- [ ] Disparador de Alerta de Anomalía ante descuadres.
- [ ] Visualización en tiempo real en el Dashboard.
- [ ] Generación correcta del Reporte PDF Certificado.

---

### Control de Aprobación Normativa
Documento aprobado para actividades en campo y **JAM de Innovación Colsubsidio 2026**.

- **Código**: `MNL-OPS-COL-2026-V2`
- **Versión**: 2.0
- **Vigencia**: 2026–2027

*Invictory_AI × Colsubsidio — Control Inteligente de Inventarios*

---
*Este manual es de uso interno operativo y confidencial. Su distribución está restringida al personal autorizado de la Dirección de Operaciones, Hotelería & Almacenes de Colsubsidio.*
