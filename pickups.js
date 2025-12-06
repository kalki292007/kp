const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const config = require('../config');
const pool = new Pool({ connectionString: config.pgUri });
async function ensureTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS postgis;
      CREATE TABLE IF NOT EXISTS pickups (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR,
        address TEXT,
        geom GEOMETRY(POINT,4326),
        scheduled_at TIMESTAMP,
        status VARCHAR DEFAULT 'SCHEDULED',
        created_at TIMESTAMP DEFAULT now()
      );
    `);
  } finally { client.release(); }
}
ensureTables().catch(e=>console.error('Ensure tables error', e));
router.post('/', async (req, res) => {
  try {
    const { userId, address, lat, lng, scheduledAt } = req.body;
    if (!address || !lat || !lng) return res.status(400).json({ error: 'Missing fields' });
    const client = await pool.connect();
    try {
      const q = `INSERT INTO pickups (user_id, address, geom, scheduled_at) VALUES ($1,$2, ST_SetSRID(ST_MakePoint($3,$4),4326), $5) RETURNING *`;
      const vals = [userId || null, address, Number(lng), Number(lat), scheduledAt || null];
      const r = await client.query(q, vals);
      res.json(r.rows[0]);
    } finally { client.release(); }
  } catch (e) {
    console.error('Pickup insert error', e);
    res.status(500).json({ error: 'Failed to schedule pickup' });
  }
});
router.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const r = await client.query('SELECT id, user_id, address, scheduled_at, status FROM pickups ORDER BY created_at DESC LIMIT 200');
      res.json(r.rows);
    } finally { client.release(); }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed' });
  }
});
module.exports = router;
