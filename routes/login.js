const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();



const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD = "admin123";

router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = router;



