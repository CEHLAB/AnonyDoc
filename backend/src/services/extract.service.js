import fs from 'fs/promises';
import pdf from '../lib/pdfNoCheck.js';
import mammoth from 'mammoth';
import path from 'path';

async function extractPdf(filePath) {
  const buffer = await fs.readFile(filePath);
  const { text } = await pdf(buffer);
  if (!text || !text.trim()) {
    throw new Error('PDF sans texte détecté');
  }
  return text;
}

async function extractDocx(filePath) {
  const { value } = await mammoth.extractRawText({ path: filePath });
  if (!value || !value.trim()) {
    throw new Error('DOCX sans texte détecté');
  }
  return value;
}

export async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      if (ext === '.pdf') {
        return await extractPdf(filePath);
      }
      if (ext === '.docx') {
        return await extractDocx(filePath);
      }
      throw new Error(`Extension non supportée : ${ext}`);
    } catch (err) {
      lastError = err;
      console.warn(
        `extractText: tentative ${attempt} pour "${filePath}" a échoué : ${err.message}`
      );
      await new Promise((resolve) => setTimeout(resolve, 200 * attempt));
    }
  }

  console.error(
    `extractText: échec après 3 essais pour "${filePath}"`,
    lastError
  );
  throw new Error(
    'Impossible d’extraire le texte (fichier corrompu ou format non supporté).'
  );
}
