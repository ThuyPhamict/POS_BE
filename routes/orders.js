const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();


// Get all active orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const dbquery = "SELECT orders.id AS order_id,customers.name AS customer_name,customers.phone, staffs.name AS staff_name, orders.total_amount FROM orders JOIN customers ON orders.customer_id = customers.id LEFT JOIN staffs ON orders.staff_id = staffs.id WHERE status = 'active'";
    const result = await db.query(dbquery);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});


// Create new order
router.post('/neworder-oldcustomer', async (req, res) => {
  const { phone, totalAmount = 0 , staff_id = 0} = req.body;

  try {
    const customerResult = await db.query('SELECT id FROM customers WHERE phone = $1', [phone]);
    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customerId = customerResult.rows[0].id;
   
    const orderResult = await db.query(
      `INSERT INTO orders (customer_id,staff_id, status, total_amount)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [customerId, staff_id , 'active', totalAmount]
    );

    res.status(201).json(orderResult.rows[0]);

  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});
module.exports = router;