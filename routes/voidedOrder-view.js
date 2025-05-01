const express = require("express");
const router = express.Router();
const db = require('../db');
require('dotenv').config();



router.get('/', async (req, res) => {
    try {
      const dbquery = "SELECT id AS order.id,customers.name AS customer_name,customers.phone AS customer_phone, staffs.name AS staff_name, orders.total_amount FROM orders JOIN customers ON orders.customer_id = customers.id LEFT JOIN staffs ON orders.staff_id = staffs.id WHERE status = 'voided'";
      const result = await db.query(dbquery);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  module.exports = router;