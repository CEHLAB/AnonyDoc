// backend/src/routes/doc.routes.js

import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { upload }      from '../middlewares/upload.middleware.js';
import {
  uploadAndAnonymize,
  listDocuments,
  getDoc,
  downloadDocument,
  downloadOriginalDocument,
  deleteOriginalFile,
  deleteDocument
} from '../controllers/doc.controller.js';

const router = Router();

router.post(
  '/upload',
  requireAuth,
  upload.single('file'),
  uploadAndAnonymize
);

router.get('/', requireAuth, listDocuments);

router.get('/:id', requireAuth, getDoc);

router.get('/download/anony/:id', requireAuth, downloadDocument);

router.get('/download/original/:id', requireAuth, downloadOriginalDocument);

router.delete('/file/:id', requireAuth, deleteOriginalFile);

router.delete('/:id', requireAuth, deleteDocument);

export default router;
