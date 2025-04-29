import { Router } from 'express';
import { anonymize } from '../controllers/ai.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();
router.post('/anonymize', requireAuth, anonymize);

export default router;
