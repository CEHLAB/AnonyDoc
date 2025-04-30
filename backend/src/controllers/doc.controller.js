import path from 'path';
import fs from 'fs/promises';
import { extractText }   from '../services/extract.service.js';
import { anonymizeText } from '../services/openai.service.js';
import { generateDocx, generatePdf } from '../services/generate.service.js';
import { PrismaClient }  from '@prisma/client';

const prisma = new PrismaClient();

export const uploadAndAnonymize = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: 'Fichier manquant' });

  try {
    const original   = await extractText(req.file.path);
    const anonymized = await anonymizeText(original);

    const ext = path.extname(req.file.originalname).toLowerCase();
    const anonPath =
      ext === '.docx'
        ? await generateDocx(anonymized, 'uploads')
        : await generatePdf(anonymized,  'uploads');

    const doc = await prisma.document.create({
      data: {
        originalname: req.file.originalname,
        filename   : req.file.filename,
        original,
        anonymized,
        filePath   : req.file.path,
        anonPath,
        user       : { connect: { id: req.user.id } }
      }
    });

    res.json({
      id         : doc.id,
      filename   : req.file.originalname,
      original,
      anonymized
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Échec de traitement' });
  }
};

export const listDocuments = async (req, res) => {
  const docs = await prisma.document.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(docs);
};

export const getDoc = async (req, res) => {
  const doc = await prisma.document.findUnique({
    where: { id: +req.params.id, userId: req.user.id }
  });
  if (!doc) return res.sendStatus(404);
  res.json(doc);
};

export const downloadDocument = async (req, res) => {
  const doc = await prisma.document.findUnique({
    where: { id: +req.params.id, userId: req.user.id }
  });
  if (!doc || !doc.anonPath) return res.sendStatus(404);
  const downloadName = `anon-${path.basename(doc.anonPath)}`;
  res.download(doc.anonPath, downloadName);
};

export const downloadOriginalDocument = async (req, res) => {
  const doc = await prisma.document.findUnique({
    where: { id: +req.params.id, userId: req.user.id }
  });
  if (!doc || !doc.anonPath) return res.sendStatus(404);
  const downloadName = `original-${path.basename(doc.anonPath)}`;
  
  res.download(doc.filePath, downloadName);
};

export const deleteOriginalFile = async (req, res) => {
  const doc = await prisma.document.findUnique({
    where: { id: +req.params.id, userId: req.user.id }
  });
  if (!doc) return res.sendStatus(404);
  if (doc.filePath) {
    try { await fs.unlink(doc.filePath); } catch {}
  }
  await prisma.document.update({
    where: { id: doc.id },
    data : { filePath: '' }
  });
  res.json({ message: 'Fichier original supprimé' });
};

export const deleteDocument = async (req, res) => {
  const doc = await prisma.document.findUnique({
    where: { id: +req.params.id, userId: req.user.id }
  });
  if (!doc) return res.sendStatus(404);
  for (const p of [doc.filePath, doc.anonPath]) {
    if (p) try { await fs.unlink(p); } catch {}
  }
  await prisma.document.delete({ where: { id: doc.id } });
  res.json({ message: 'Document supprimé' });
};
