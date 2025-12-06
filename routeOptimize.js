const express = require('express');
const axios = require('axios');
const config = require('../config');
const router = express.Router();
router.post('/', async (req, res) => {
  try {
    const { vehicle, pickups } = req.body;
    if (!vehicle || !Array.isArray(pickups)) return res.status(400).json({ error: 'Missing body' });
    const coords = [];
    const start = vehicle.start || { lat: pickups[0].lat, lng: pickups[0].lng };
    coords.push(`${start.lat},${start.lng}`);
    pickups.forEach(p => coords.push(`${p.lat},${p.lng}`));
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;
    const params = { origins: coords.join('|'), destinations: coords.join('|'), key: config.googleMapsKey, mode: 'driving' };
    const r = await axios.get(url, { params });
    const matrix = r.data.rows.map(row => row.elements);
    const n = pickups.length;
    const visited = new Array(n).fill(false);
    const order = [];
    let currentIndex = 0;
    for (let step=0; step<n; step++) {
      let best = -1; let bestTime = Number.MAX_SAFE_INTEGER;
      for (let i=0;i<n;i++){
        if (visited[i]) continue;
        const matrixIdx = i+1;
        const elem = matrix[currentIndex][matrixIdx];
        if (!elem || elem.status !== 'OK') continue;
        const t = elem.duration.value;
        if (t < bestTime) { bestTime = t; best = i; }
      }
      if (best === -1) { for (let i=0;i<n;i++) if (!visited[i]) { best = i; break; } }
      visited[best] = true;
      order.push(pickups[best]);
      currentIndex = best + 1;
    }
    res.json({ orderedPickups: order });
  } catch (e) {
    console.error('Route optimize error', e?.response?.data || e.message || e);
    res.status(500).json({ error: 'Route optimization failed', details: e?.message });
  }
});
module.exports = router;
