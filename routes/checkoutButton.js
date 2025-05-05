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
     
            const result = await db.query(
              'SELECT 1 FROM orderitems WHERE order_id = $1 AND product_id = $2',
              [orderId, item.productId]
            );
          
            if (result.rowCount > 0) {
              // Update existing
              await db.query(
                `UPDATE orderitems 
                 SET quantity = $1, unit_price = $2 
                 WHERE order_id = $3 AND product_id = $4`,
                [item.quantity, item.unit_price, orderId, item.productId]
              );
            } else {
              // Insert new
              await db.query(
                `INSERT INTO orderitems (order_id, product_id, quantity, unit_price)
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.productId, item.quantity, item.unit_price]
              );
            }
          }

        res.status(201).json({ success: true, order: orderResult.rows[0] });
    }catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ error: "Failed to create order" });
    }
});

module.exports = router;