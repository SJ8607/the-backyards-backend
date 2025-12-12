const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- 1. DATABASE CONNECTION ---
// (Keep your actual connection string here!)
const MONGO_URI = "mongodb+srv://admin:Shambhoo1542@cluster1.l3o4ipz.mongodb.net/?appName=Cluster1";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));


// --- 2. DEFINE THE ORDER BLUEPRINT (SCHEMA) ---
const orderSchema = new mongoose.Schema({
  tableNumber: String,
  items: Object, // Stores the cart data { "1": 2, "3": 1 }
  totalAmount: Number,
  status: { type: String, default: 'Pending' }, // Pending, Paid, Completed
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);


// --- 3. CREATE THE API ENDPOINT ---
// The Frontend will send data to this URL: http://localhost:5000/api/orders
app.post('/api/orders', async (req, res) => {
  try {
    const { tableNumber, items, totalAmount } = req.body;

    // Create a new order in the database
    const newOrder = new Order({
      tableNumber,
      items,
      totalAmount
    });

    // Save it!
    await newOrder.save();

    console.log("New Order Saved:", newOrder);
    res.status(201).json({ message: "Order Placed Successfully!", orderId: newOrder._id });
  } catch (error) {
    res.status(500).json({ message: "Error saving order", error });
  }
});

// --- 4. NEW: GET ALL ORDERS API ---
// The Kitchen Dashboard will call this to see the list
app.get('/api/orders', async (req, res) => {
  try {
    // Find all orders in the database
    const orders = await Order.find(); 
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// --- 5. NEW: COMPLETE ORDER API (Delete) ---
// The Kitchen sends an Order ID, and we delete it from the database
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log("Backend updated with Menu APIs");