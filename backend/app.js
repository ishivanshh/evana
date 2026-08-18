import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running'
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
