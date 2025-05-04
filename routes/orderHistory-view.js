const express = require("express");
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
require('dotenv').config();



router.get('/',authenticateToken, async (req, res) => {
    try {
      const dbquery = `SELECT orders.id AS id,
    customers.name AS customer_name,
    customers.phone AS customer_phone, 
    staffs.name AS staff_name, 
    orders.total_amount 
    FROM orders 
    JOIN customers ON orders.customer_id = customers.id 
    LEFT JOIN staffs ON orders.staff_id = staffs.id 
    WHERE status = 'active'`;
      const result = await db.query(dbquery);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  module.exports = router;