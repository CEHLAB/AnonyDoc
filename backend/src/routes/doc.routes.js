// backend/src/routes/doc.routes.js

import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { upload }      from '../middlewares/upload.middleware.js';
import {
  uploadAndAnonymize,
  listDocuments,
  getDoc,
  downloadDocument,
  deleteOriginalFile,
  deleteDocument
} from '../controllers/doc.controller.js';

const router = Router();

// 1. Upload + anonymisation
router.post(
  '/upload',
  requireAuth,
  upload.single('file'),
  uploadAndAnonymize
);

// 2. Liste (historique)
router.get('/', requireAuth, listDocuments);

// 3. Détail
router.get('/:id', requireAuth, getDoc);

// 4. Download anonymisé
router.get('/download/:id', requireAuth, downloadDocument);

// 5. Supprimer fichier original
router.delete('/file/:id', requireAuth, deleteOriginalFile);

// 6. Supprimer toute la ligne
router.delete('/:id', requireAuth, deleteDocument);

export default router;
