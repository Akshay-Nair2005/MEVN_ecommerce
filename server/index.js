const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON

const CONNECTION_STRING = "mongodb://127.0.0.1:27017/";
const dbName = "ecommerce";
let database;
let collection;

// ----------------- MongoDB Connection -----------------
async function connectDB() {
  try {
    const client = await MongoClient.connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    database = client.db(dbName);
    collection = database.collection("ecommercec");

    console.log("✅ Connected to MongoDB & collection ready");

    // Start server only after DB is ready
    app.listen(2500, () => {
      console.log("🚀 Server running at http://localhost:2500");
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}
connectDB();




const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/api/stripe/create-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert ₹ → paise
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });
    res.json({ client_secret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});


// ----------------- Cart API -----------------

// Get all cart items
app.get("/server/ecommerce/GetCartItems", async (req, res) => {
  try {
    const result = await collection.find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    res.status(500).json({ error: "Failed to retrieve cart items" });
  }
});

// Add item to cart
app.post("/server/ecommerce/AddToCart", async (req, res) => {
  try {
    const { productId, quantity, product } = req.body;

    const result = await collection.insertOne({
      productId,
      quantity,
      product,
    });

    res.json({ message: "Added to cart successfully", id: result.insertedId });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Delete item from cart
app.delete("/server/ecommerce/DeleteCartItem", async (req, res) => {
  try {
    const id = req.query.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.json({ message: "Deleted Successfully" });
    } else {
      res.status(404).json({ error: "Cart item not found" });
    }
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});
