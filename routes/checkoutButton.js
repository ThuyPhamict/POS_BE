const express = require("express");
const router = express.Router();
const db = require('../db');
require('dotenv').config();

// Update orders 
router.post('/', async(req,res) => {
    try{
        const { staffId, orderId, total, items } = req.body;
        

        const orderResult = await db.query(
            'UPDATE orders SET staff_id = $1, status = $2, total = $3 WHERE id = $4 RETURNING *',
             [staffId , 'done' , total , orderId]
        );
        res.status(201).json({ success: true, order: orderResult.rows[0] });
    }catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ error: "Failed to create order" });
    }
});

module.exports = router;