import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera y descarga un reporte PDF profesional en modo Eco-Friendly (Ahorro de Tinta para el Medio Ambiente)
 * formateado según el Corporate Innovation Framework (docs/DESIGN .md).
 * Diseñado específicamente para verificación física en campo (cuartos fríos, cavas, zonas calientes sin conectividad).
 *
 * @param {Object} summary Data de descuadres del dashboard
 */
export function generateDiscrepancyPDF(summary) {
  if (!summary || !summary.items_descuadrados) {
    alert("No hay datos de descuadres disponibles para exportar a PDF.");
    return;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const contentWidth = pageWidth - (marginX * 2);

  // Paleta de Colores Corporativa Eco-Friendly (docs/DESIGN .md)
  const ACTION_BLUE = [0, 66, 123];      // #00427b
  const ACCENT_YELLOW = [253, 208, 0];   // #FDD000
  const ALERT_RED = [227, 6, 19];        // #E30613
  const SUCCESS_GREEN = [40, 167, 69];   // #28A745
  const CHARCOAL = [17, 24, 39];         // #111827
  const MUTED_TEXT = [114, 119, 130];    // #727782
  const ECO_HEADER_BG = [241, 243, 255]; // #f1f3ff (Surface Container Low)
  const BORDER_COLOR = [193, 198, 211];  // #c1c6d3

  // --- CABECERA ECO-FRIENDLY (FONDO BLANCO / AHORRO DE TINTA) ---
  // Línea superior decorativa en Action Blue & Accent Yellow
  doc.setDrawColor(...ACTION_BLUE);
  doc.setLineWidth(1.2);
  doc.line(marginX, 12, pageWidth - marginX, 12);

  doc.setDrawColor(...ACCENT_YELLOW);
  doc.setLineWidth(1.2);
  doc.line(marginX, 13.2, marginX + 45, 13.2);

  // Nombre de la marca e Identidad de la Hackathon
  doc.setTextColor(...ACTION_BLUE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("INVICTORY_AI", marginX, 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...CHARCOAL);
  doc.text("RETO HOTELERÍA | HACKATHON COLSUBSIDIO X 30X", marginX + 48, 22);

  // Fecha de Emisión (Lado derecho alineado)
  const now = new Date();
  const fechaStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED_TEXT);
  doc.text(`Fecha: ${fechaStr}`, pageWidth - marginX, 22, { align: 'right' });

  // --- TÍTULO PRINCIPAL JUSTIFICADO (SIN EMOJIS MULTI-BYTE PARA EVITAR ERRORES DE CODIFICACIÓN) ---
  let currentY = 32;

  doc.setTextColor(...ACTION_BLUE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("REPORTE DIGITAL DE AUDITORÍA DE DESCUADRES ERP", marginX, currentY);

  currentY += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED_TEXT);

  const descText = "Documento digital certificado para auditoría formal de descuadres, firmas de supervisión y respaldo en contingencias de baja conectividad. Impresión optimizada en modo Eco-Friendly para sostenibilidad ambiental.";
  const splitDesc = doc.splitTextToSize(descText, contentWidth);
  doc.text(splitDesc, marginX, currentY);

  currentY += (splitDesc.length * 4) + 3;

  // --- PANEL RESUMEN KPI (ECO-FRAME CON FONDO SUAVE) ---
  doc.setFillColor(...ECO_HEADER_BG);
  doc.roundedRect(marginX, currentY, contentWidth, 18, 2, 2, 'F');
  doc.setDrawColor(...BORDER_COLOR);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, currentY, contentWidth, 18, 2, 2, 'S');

  const kpiY = currentY + 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);

  doc.setTextColor(...ACTION_BLUE);
  doc.text(`TOTAL SKUS: ${summary.total_skus}`, marginX + 6, kpiY);
  doc.text(`BODEGAS: ${summary.total_bodegas}`, marginX + 48, kpiY);

  doc.setTextColor(...ALERT_RED);
  doc.text(`DESCUADRES: ${summary.total_descuadres}`, marginX + 90, kpiY);

  doc.setTextColor(...SUCCESS_GREEN);
  doc.text(`PRECISIÓN GLOBAL: ${summary.porcentaje_precision}%`, marginX + 135, kpiY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...CHARCOAL);
  doc.text("Instrucciones: Re-inspeccione físicamente los artículos indicados y anote la cantidad real en la casilla de verificación.", marginX + 6, kpiY + 7);

  currentY += 24;

  // --- TABLA DE DESCUADRES (MODO ECO-PRINT DE ALTO CONTRASTE Y BAJO CONSUMO DE TINTA) ---
  const tableData = summary.items_descuadrados.map(item => {
    const difStr = item.diferencia > 0 ? `+${item.diferencia}` : `${item.diferencia}`;
    return [
      item.sku,
      `${item.articulo}\n(${item.unidad})`,
      item.bodega,
      `${item.cantidad_sistema}`,
      `${item.cantidad_fisica}`,
      difStr,
      item.estado,
      "[   ]  ___ real: ______"
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['SKU', 'Artículo / Insumo', 'Bodega', 'ERP', 'IA', 'Dif.', 'Estado', 'Verificación Física (Campo)']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: ECO_HEADER_BG,
      textColor: ACTION_BLUE,
      fontStyle: 'bold',
      fontSize: 8,
      lineWidth: 0.4,
      lineColor: ACTION_BLUE,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: CHARCOAL,
      valign: 'middle',
      lineWidth: 0.2,
      lineColor: [225, 232, 253]
    },
    columnStyles: {
      0: { cellWidth: 18, fontStyle: 'bold' },
      1: { cellWidth: 46 },
      2: { cellWidth: 32 },
      3: { cellWidth: 13, halign: 'right' },
      4: { cellWidth: 13, halign: 'right', fontStyle: 'bold' },
      5: { cellWidth: 13, halign: 'right', fontStyle: 'bold' },
      6: { cellWidth: 20, halign: 'center' },
      7: { cellWidth: 27, halign: 'center', fontSize: 7, textColor: [100, 100, 100] }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 6) {
        const estado = data.cell.raw;
        if (estado === 'FALTANTE') {
          data.cell.styles.textColor = ALERT_RED;
          data.cell.styles.fontStyle = 'bold';
        } else if (estado === 'SOBRANTE') {
          data.cell.styles.textColor = SUCCESS_GREEN;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    margin: { top: 30, bottom: 20, left: marginX, right: marginX }
  });

  // --- FIRMAS Y FOOTER SUSTENTABLE ---
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 200;

  if (finalY + 28 < pageHeight) {
    doc.setDrawColor(...BORDER_COLOR);
    doc.setLineWidth(0.4);
    doc.line(marginX + 10, finalY + 14, marginX + 70, finalY + 14);
    doc.line(pageWidth - marginX - 70, finalY + 14, pageWidth - marginX - 10, finalY + 14);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED_TEXT);
    doc.text("Firma Operario de Bodega (Auditor en Campo)", marginX + 10, finalY + 18);
    doc.text("Firma Supervisor de Almacén / ERP", pageWidth - marginX - 70, finalY + 18);
  }

  // Pie de página fijo de sostenibilidad
  doc.setFontSize(7);
  doc.setTextColor(...MUTED_TEXT);
  doc.text(
    "INVICTORY_AI — Reto Hotelería Colsubsidio x 30X — Impresión Eco-Friendly optimizada para sostenibilidad y ahorro de tinta",
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  // Descargar archivo PDF
  const filename = `invictory_guia_campo_eco_${now.toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
