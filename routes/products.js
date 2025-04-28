// routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a product
router.post('/', async (req, res) => {
  const { id, name, price, stock_quantity } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO Products (id, name, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, name, price, stock_quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
