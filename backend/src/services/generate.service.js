import fs from 'fs/promises';
import path from 'path';
import { Document, Packer, Paragraph } from 'docx';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/* DOCX → DOCX */
export async function generateDocx(text, dest) {
  const doc = new Document({
    sections: [{ children: text.split('\n').map(t => new Paragraph(t)) }]
  });
  const buffer = await Packer.toBuffer(doc);
  const out = path.join(dest, `anon-${Date.now()}.docx`);
  await fs.writeFile(out, buffer);
  return out;
}

/* PDF → PDF  (simple : une page, texte brut) */
export async function generatePdf(text, dest) {
  const pdfDoc = await PDFDocument.create();
  const page   = pdfDoc.addPage();
  const font   = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();
  let y = height - 50;
  text.split('\n').forEach(line => {
    page.drawText(line, { x: 50, y, size: 12, font, color: rgb(0, 0, 0) });
    y -= 16;
  });
  const bytes = await pdfDoc.save();
  const out = path.join(dest, `anon-${Date.now()}.pdf`);
  await fs.writeFile(out, bytes);
  return out;
}
