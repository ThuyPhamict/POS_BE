const express = require('express');
const router = express.Router();
const db = require('../db');
require('dotenv').config();


// Route to look up customer by phone
router.get('/', async (req, res) => {
  const { phone } = req.query;

  try {
    const result = await db.query('SELECT name FROM customers WHERE phone = $1', [phone]);

    
    if (result.rows.length > 0) {
      res.json({ found: true, name: result.rows[0].name });
    } else {
      res.json({ found: false });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to look up unknown customer 

router.post('/unknown-customers', async (req, res) => {

    const { phone, name = "unknown", totalAmount = 0, staff_id = 0} = req.body;

    try {
      let customerResult = await db.query('SELECT id FROM customers WHERE phone = $1', [phone]);
    
      // If customer doesn't exist, insert
      if (customerResult.rows.length === 0) {
        const insertResult = await db.query(
          'INSERT INTO customers (name, phone) VALUES ($1, $2) RETURNING id',
          [name, phone]
        );
        customerResult = insertResult;
      }
    
      const customerId = customerResult.rows[0].id;
    
      const orderResult = await db.query(
        `INSERT INTO orders (customer_id,staff_id, status, total_amount)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [customerId, staff_id , 'active', totalAmount]
      );
    
      res.status(201).json({ success: true, order: orderResult.rows[0] });
    
    } catch (err) {
      console.error("Error creating order:", err);
      res.status(500).json({ error: "Failed to create order" });
    }


});



module.exports = router;
