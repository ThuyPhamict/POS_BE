const express = require("express");
const router = express.Router();
const db = require('../db');
require('dotenv').config();

// Update orders 
router.post('/', async(req,res) => {
    try{
        const { orderId, productId, quantity, unit_price } = req.body;
        console.log(orderId);

        const orderItemsResult = await db.query(
            `INSERT INTO orderitems(order_id, product_id, quantity, unit_price) VALUES ($1,$2,$3,$4) RETURNING *`,
            [orderId, productId, quantity, unit_price ]
        );
        
        res.status(201).json({ success: true, order: orderItemsResult.rows[0] });
    }catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ error: "Failed to create order" });
    }
});

module.exports = router;