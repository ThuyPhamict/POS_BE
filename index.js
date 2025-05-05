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
const staffsRoutes = require('./routes/staffs');
const checkoutButtonRoutes =require('./routes/checkoutButton');
const orderHistoryView = require('./routes/orderHistory-view');
const voidedOrderView = require('./routes/voidedOrder-view');
const orderItemsView =  require('./routes/orderItems');


app.use(cors({ origin: ['http://localhost:5173', 'https://pos-be-pham-5c635ce0026f.herokuapp.com', 'https://pos-ui-pham-a9bc85f0fe21.herokuapp.com'], credentials: true }));
app.use(express.json());

// Import routes
app.use('/api/login', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customerphonecheck', customerRoutes);
app.use('/api/newcustomers', newcustomersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/staffs', staffsRoutes);
app.use('/api/checkoutButton', checkoutButtonRoutes);
app.use('/api/orderhistoryview', orderHistoryView);
app.use('/api/voidedorderview', voidedOrderView);
app.use('/api/orderItems', orderItemsView);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});