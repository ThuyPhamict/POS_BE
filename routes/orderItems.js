const express = require("express");
const router = express.Router();
const db = require('../db');
require('dotenv').config();

// Update orders 
router.post('/', async(req,res) => {
    try{
        const { orderId, items} = req.body;

        await db.query('DELETE FROM orderitems WHERE order_id = $1', [orderId]);

        items.forEach(async element => {
            const { productId, quantity, unit_price} = element; 
            const orderItemsResult = await db.query(
                `INSERT INTO orderitems(order_id, product_id, quantity, unit_price) VALUES ($1,$2,$3,$4) RETURNING *`,
                [orderId, productId, quantity, unit_price ]
            );
        });
        
        res.status(201).json({ success: true, orderId: orderId});
    }catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ error: "Failed to create order" });
    }
});

module.exports = router;