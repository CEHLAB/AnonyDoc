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
  const out = path.join(dest, `${Date.now()}.docx`);
  await fs.writeFile(out, buffer);
  return out;
}

/* PDF → PDF  */

export async function generatePdf(text, dest) {
  const pdfDoc = await PDFDocument.create();
  const font   = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const margin     = 50;
  const fontSize   = 12;
  const lineHeight = fontSize * 1.2;

  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const maxWidth = width - margin * 2;

  function wrapLines(text) {
    const lines = [];
    for (const paragraph of text.split('\n')) {
      const words = paragraph.split(' ');
      let line = '';
      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(testLine, fontSize) <= maxWidth) {
          line = testLine;
        } else {
          if (line) lines.push(line);
          // gérer un mot trop long
          if (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
            let sub = '';
            for (const char of word) {
              const subTest = sub + char;
              if (font.widthOfTextAtSize(subTest, fontSize) > maxWidth) {
                lines.push(sub);
                sub = char;
              } else {
                sub = subTest;
              }
            }
            if (sub) lines.push(sub);
            line = '';
          } else {
            line = word;
          }
        }
      }
      if (line) lines.push(line);
    }
    return lines;
  }

  const wrapped = wrapLines(text);

  // écriture page par page
  let y = height - margin;
  for (const line of wrapped) {
    if (y < margin) {
      page = pdfDoc.addPage();
      y = height - margin;
    }
    page.drawText(line, {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    y -= lineHeight;
  }

  const bytes = await pdfDoc.save();
  const out   = path.join(dest, `${Date.now()}.pdf`);
  await fs.writeFile(out, bytes);
  return out;
}
