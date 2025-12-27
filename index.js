const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- 1. DATABASE CONNECTION ---
const MONGO_URI = "mongodb+srv://admin:Shambhoo1542@cluster1.l3o4ipz.mongodb.net/?appName=Cluster1";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));


// ==========================================
// 2. ORDER SYSTEM (Existing Logic)
// ==========================================
const orderSchema = new mongoose.Schema({
  tableNumber: String,
  items: Object,
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// API: Place Order
app.post('/api/orders', async (req, res) => {
  try {
    const { tableNumber, items, totalAmount } = req.body;
    const newOrder = new Order({ tableNumber, items, totalAmount });
    await newOrder.save();
    res.status(201).json({ message: "Order Placed!", orderId: newOrder._id });
  } catch (error) {
    res.status(500).json({ message: "Error saving order", error });
  }
});

// API: Get Orders (Kitchen)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find(); 
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// API: Delete Order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
});


// ==========================================
// 3. MENU SYSTEM (THIS WAS MISSING!) 🍔
// ==========================================

// A. Define Menu Item Schema
const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String
});
const MenuItem = mongoose.model('MenuItem', menuSchema);

// B. API: Get Menu (For Customer & Admin)
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu" });
  }
});

// C. API: Add Item (For Admin)
app.post('/api/menu', async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const newItem = new MenuItem({ name, price, category, description });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding item" });
  }
});

// D. API: Delete Item (For Admin)
app.delete('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await MenuItem.findByIdAndDelete(id);
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

// ==========================================

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});