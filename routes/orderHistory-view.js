const express = require("express");
const router = express.Router();
const db = require('../db');




router.get('/', async (req, res) => {
    try {
      const dbquery = `SELECT orders.id AS id,
    customers.name AS customer_name,
    customers.phone AS customer_phone, 
    staffs.name AS staff_name, 
    orders.total_amount 
    FROM orders 
    JOIN customers ON orders.customer_id = customers.id 
    LEFT JOIN staffs ON orders.staff_id = staffs.id 
    WHERE status = 'done' `;
      const result = await db.query(dbquery);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });


  router.get('/ordercart', async (req, res) => {
    const { orderId } = req.query;
  
    if (!orderId) {
      return res.status(400).json({ message: 'Missing orderId in query parameters.' });
    }
  
    try {
      const result = await db.query(
        `SELECT 
           oi.id, 
           oi.order_id, 
           oi.product_id, 
           oi.quantity, 
           oi.unit_price AS price,
           p.name 
         FROM orderitems oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [orderId]
      );
  
      res.status(200).json({
        items: result.rows,

      });
    } catch (error) {
      console.error('Error fetching order items:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.post('/void-order', async(req,res) => {
    const {orderId} = req.body;
    try{
      const result = await db.query(`UPDATE orders SET  status = $1 WHERE id = $2 RETURNING *`,
      ['voided', orderId]);
    
      res.status(200).json({ message: 'Order voided successfully', order: result.rows[0] });
    } catch (error) {
      console.error('Error voiding order:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  module.exports = router;