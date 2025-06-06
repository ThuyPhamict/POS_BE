const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();


// Get all active orders
router.get('/', authenticateToken, async (req, res) => {
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
    const orders = result.rows;
 

    if (orders.length === 0) {
      return res.status(200).json([]); 
    }
    const itemQuery = `
      SELECT 
        oi.order_id,
        p.name AS product_name,
        oi.quantity,
        oi.unit_price
      FROM orderitems oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ANY($1::int[])
    `;
    const orderIds = orders.map(order => order.id);
    const itemsResult = await db.query(itemQuery, [orderIds]);

    // Create a map of items by order ID
    const itemsMap = itemsResult.rows.reduce((map, item) => {
      if (!map[item.order_id]) {
        map[item.order_id] = [];
      }
      map[item.order_id].push(item);
      return map;
    }, {});

    // Add the items to each order
    orders.forEach(order => {
      order.items = itemsMap[order.id] || [];
    });

    // Send the orders with items
    res.status(200).json(orders);

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