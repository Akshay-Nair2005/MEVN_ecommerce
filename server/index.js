import express from 'express';
import {MongoClient,ObjectId} from 'mongodb'
import cors from 'cors'

import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON

const CONNECTION_STRING = "mongodb://127.0.0.1:27017/";
const dbName = "ecommerce";
let database;
let collection;


export default async function db() {
  if (mongoose.connection.readyState === 1) return; // Already connected
  return mongoose.connect(process.env.MONGO_URL);
}


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


app.post("/server/auth/mongo-signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exist = await database.collection("users").findOne({ email });

    if (exist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await database.collection("users").insertOne({
      email,
      password,
      provider: "mongodb",
      createdAt: new Date(),
    });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/server/auth/mongo-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await database.collection("users").findOne({
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


import Stripe from 'stripe';
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
    const uid = req.query.uid;

     if (!uid) {
      return res.status(400).json({ error: "Missing uid" });
    }


    const result = await collection.find({uid}).toArray();
    res.json(result);
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    res.status(500).json({ error: "Failed to retrieve cart items" });
  }
});

// Add item to cart
app.post("/server/ecommerce/AddToCart", async (req, res) => {
  try {
    const { uid,productId, quantity, product } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "Missing user UID" });
    }
    const result = await collection.insertOne({
      uid,
      productId,
      quantity,
      product,
      createdAt: new Date()
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


// ----------------- User Storage API -----------------

app.post("/server/ecommerce/StoreUser", async (req, res) => {
  try {
    const { uid, email, name } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: "Missing uid or email" });
    }

    // Check if user already exists
    const existingUser = await database.collection("users").findOne({ uid });

    if (existingUser) {
      return res.json({ message: "User already stored", user: existingUser });
    }

    // Insert new user
    const newUser = {
      uid,
      email,
      name,
      createdAt: new Date(),
    };

    await database.collection("users").insertOne(newUser);

    res.json({ message: "User stored successfully", user: newUser });

  } catch (error) {
    console.error("Error storing user:", error);
    res.status(500).json({ error: "Failed to store user" });
  }
});


app.post("/api/custom-login", async (req, res) => {
  const { email, password } = req.body;

  const user = await database.collection("users").findOne({ email });

  if (!user)
    return res.status(404).json({ error: "User not found" });

  if (user.password !== password)
    return res.status(401).json({ error: "Wrong password" });

  return res.json({ success: true, user });
});

