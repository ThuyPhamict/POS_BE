const express = require("express");
const router = express.Router();
const db = require('../db');
require('dotenv').config();

// GET all products
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM staffs');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
