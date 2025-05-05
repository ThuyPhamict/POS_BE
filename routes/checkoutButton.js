const express = require("express");
const router = express.Router();
const db = require('../db');
require('dotenv').config();

// Update orders 
router.post('/', async(req,res) => {
    try{
        const { staffId, orderId, total, items } = req.body;
        

        const orderResult = await db.query(
            'UPDATE orders SET staff_id = $1, status = $2, total_amount = $3 WHERE id = $4 RETURNING *',
             [staffId , 'done' , total , orderId]
        );

        for (const item of items) {
            await db.query(
              'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
              [item.quantity, item.productId]
            );
     
            await db.query(
              `INSERT INTO orderitems (order_id, product_id, quantity, unit_price)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (order_id, product_id)
               DO UPDATE SET quantity = EXCLUDED.quantity, unit_price = EXCLUDED.unit_price`,
              [orderId, item.productId, item.quantity, item.unit_price]
            );
          }

        res.status(201).json({ success: true, order: orderResult.rows[0] });
    }catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ error: "Failed to create order" });
    }
});

module.exports = router;