const express = require('express');
const Bin = require('../models/Bin');
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const bins = await Bin.find({}).limit(200);
    res.json(bins);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch bins' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const bin = await Bin.findOne({ binId: req.params.id });
    if (!bin) return res.status(404).json({ error: 'Not found' });
    res.json(bin);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
