const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

const authRoutes = require('./routes/login');
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customerAvailableCheck');
const newcustomersRoutes = require('./routes/newcustomers');
const productsRoutes = require('./routes/products');

app.use(cors({ origin: ['http://localhost:5173', 'https://pos-ui-pham-a9bc85f0fe21.herokuapp.com'], credentials: true }));
app.use(express.json());

// Import routes
app.use('/api/login', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customerphonecheck', customerRoutes);
app.use('/api/newcustomers', newcustomersRoutes);
app.use('/api/products',productsRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});