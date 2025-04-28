const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

const authRoutes = require('./routes/login');
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customerAvailableCheck');
const newcustomersRoutes = require('./routes/newcustomers');

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Import routes
app.use('/api/login', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customerphonecheck', customerRoutes);
app.use('/api/newcustomers', newcustomersRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});