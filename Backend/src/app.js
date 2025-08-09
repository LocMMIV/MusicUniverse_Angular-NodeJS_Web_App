import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health",  async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: rows[0]?.ok === 1 });
  } catch (err) {
    console.error("DB ERROR:", err); // log full trong console
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default app;