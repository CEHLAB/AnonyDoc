import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/',                       
  filename   : (_r, f, cb) =>
    cb(null, Date.now() + path.extname(f.originalname))
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },        // 10 Mo max
  fileFilter: (_r, f, cb) => {
    const ok = /\.(pdf|docx)$/i.test(f.originalname);
    cb(ok ? null : new Error('Format non supporté'), ok);
  }
});
