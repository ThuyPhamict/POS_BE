const express = require('express');
const router = express.Router();
const db = require('../db');
require('dotenv').config();

// New customer within name and phone
router.post('/', async (req, res) => {
    const { name, phone, totalAmount =0, staff_id = 0} = req.body;
  
    try {
        // Insert customer infor into data
      const customerInsert = await db.query(
        'INSERT INTO customers (name, phone) VALUES ($1, $2) RETURNING id',
        [name, phone]
      );
  

      const customerId = customerInsert.rows[0].id;

      // Create new order for this customer
      const orderResult = await db.query(
        `INSERT INTO orders (customer_id,staff_id, status, total_amount)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [customerId, staff_id , 'active', totalAmount]
      );
  
      res.status(201).json({
        message: 'Customer and order created successfully',
        customerId,
        order: orderResult.rows[0]
      });
  
    } catch (err) {
      console.error('Error saving customer and order:', err);
      res.status(500).json({ error: 'Failed to save customer and order', details: err.message });
    }
    
});


// New customer with unknown name and unknown phone


module.exports = router; 