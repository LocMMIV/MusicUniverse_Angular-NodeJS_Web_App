// src/app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { pool } from './db.js';

import mountRoutes from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares chung
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve ảnh/nhạc upload
app.use("/uploads", express.static("uploads"));

//Health check
app.get("/health",  async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: rows[0]?.ok === 1 });
  } catch (err) {
    console.error("DB ERROR:", err.message); // log full trong console
    res.status(500).json({ ok: false, error: "Không kết nối được database!" });
  }
});

 // Mount các routes API
mountRoutes(app);

// 404 Not Found
app.use(notFound);
app.use(errorHandler);

export default app;