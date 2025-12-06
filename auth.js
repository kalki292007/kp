const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const router = express.Router();
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email+password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'User exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, role: role || 'citizen' });
    await user.save();
    res.json({ id: user._id, email: user.email, name: user.name });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'registration failed' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ sub: user._id, role: user.role, email: user.email }, config.jwtSecret, { expiresIn: '8h' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'login failed' });
  }
});
module.exports = router;
