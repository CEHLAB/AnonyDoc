import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import aiRoutes from './routes/ai.routes.js';
import docRoutes from './routes/doc.routes.js';



dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/doc', docRoutes);
app.use('/api/ai', aiRoutes); 


app.listen(process.env.PORT, () =>
  console.log(`Server up on http://localhost:${process.env.PORT}`)
);
