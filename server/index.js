// server.js
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import Stripe from "stripe";
import "dotenv/config";

const app = express();

// ----- MIDDLEWARE -----
app.use(cors());
app.use(express.json());

// ----- CONFIG -----
const PORT = process.env.PORT || 2500;

// If you want, you can put full URL like "mongodb://127.0.0.1:27017/ecommerce" in MONGO_URL
const CONNECTION_STRING =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/";
const DB_NAME = process.env.DB_NAME || "ecommerce";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey);

// ----- DB VARS -----
let database;
let cartCollection;    // your "ecommercec" collection
let usersCollection;
let ordersCollection;
let productsCollection;
let reviewsCollection;


// ----- CONNECT TO MONGODB -----
async function connectDB() {
  try {
    const client = await MongoClient.connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    database = client.db(DB_NAME);

    // same collection name you used before
    cartCollection = database.collection("ecommercec");
    usersCollection = database.collection("users");
    ordersCollection = database.collection("orders");
    productsCollection = database.collection("products");
    reviewsCollection = database.collection("reviews");

    console.log("✅ Connected to MongoDB:", DB_NAME);

    // Start server only after DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

connectDB();

// ===================================================
//                    AUTH ROUTES
// ===================================================

// Signup with Mongo (email + password)
app.post("/server/auth/mongo-signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const exist = await usersCollection.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const result = await usersCollection.insertOne({
      email,
      password,
      provider: "mongodb",
      createdAt: new Date(),
      isAdmin:false
    });

    res.json({ success: true, user: result });
  } catch (error) {
    console.error("mongo-signup error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Basic login
app.post("/server/auth/mongo-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersCollection.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("mongo-login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Another custom login (same logic)
app.post("/api/custom-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Wrong password" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("custom-login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ===================================================
//                 STRIPE PAYMENT INTENT
// ===================================================

app.post("/api/stripe/create-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // rupees → paise
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ client_secret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

// ===================================================
//                     CART ROUTES
// ===================================================

// Get all cart items for a user
app.get("/server/ecommerce/GetCartItems", async (req, res) => {
  try {
    const uid = req.query.uid;

    if (!uid) {
      return res.status(400).json({ error: "Missing uid" });
    }

    const result = await cartCollection.find({ uid }).toArray();
    res.json(result);
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    res.status(500).json({ error: "Failed to retrieve cart items" });
  }
});

//get all products
app.get("/server/ecommerce/GetProducts", async (req, res) => {
  try {
    const products = await productsCollection.find().toArray();
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

//get single product by id
app.get("/server/ecommerce/GetProducts/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Product ID must be a number" });
    }

    const product = await productsCollection.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});

// Add new product
app.post("/server/ecommerce/AddProduct", async (req, res) => {
  try {
    const { id, title, price, description, category, image, rating } = req.body;

    if (!id || !title || !price || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProduct = {
      id: Number(id),
      title,
      price: Number(price),
      description,
      category,
      image,
      rating: rating || { rate: 0, count: 0 },
      createdAt: new Date(),
    };

    const result = await productsCollection.insertOne(newProduct);
    res.status(201).json({ message: "Product added successfully", id: result.insertedId });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Update product
app.put("/server/ecommerce/UpdateProduct/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, price, description, category, image, rating } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const updateData = {
      title,
      price: Number(price),
      description,
      category,
      image,
      rating,
      updatedAt: new Date(),
    };

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product
app.delete("/server/ecommerce/DeleteProduct/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});


//get orders for a user
app.get("/server/ecommerce/GetOrders", async (req, res) => {
  try {
    const uid = req.query.uid;

    if (!uid) {
      return res.status(400).json({ error: "Missing uid" });
    }

    const result = await ordersCollection.find({ uid }).toArray();
    res.json(result);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
});

// Add item to cart
app.post("/server/ecommerce/AddToCart", async (req, res) => {
  try {
    const { uid, productId, quantity, product } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "Missing user UID" });
    }

    const result = await cartCollection.insertOne({
      uid,
      productId,
      quantity,
      product,
      createdAt: new Date(),
    });

    res.json({
      message: "Added to cart successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Delete item from cart
app.delete("/server/ecommerce/DeleteCartItem", async (req, res) => {
  try {
    const id = req.query.id;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await cartCollection.deleteOne({ _id: new ObjectId(id) });

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

// ===================================================
//                  USER MANAGEMENT
// ===================================================

// Get all users
app.get("/server/ecommerce/GetUsers", async (req, res) => {
  try {
    const allUsers = await usersCollection.find().toArray();
    res.json(allUsers);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// Get user by uid (for checking admin status)
app.get("/server/ecommerce/GetUser/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;

    if (!uid) {
      return res.status(400).json({ error: "Missing uid" });
    }

    const user = await usersCollection.findOne({ uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

// Update user (for toggling admin status)
app.put("/server/ecommerce/UpdateUser/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { isAdmin } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isAdmin: Boolean(isAdmin), updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete user
app.delete("/server/ecommerce/DeleteUser/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ===================================================
//                  USER STORAGE / ADDRESS
// ===================================================

app.post("/server/ecommerce/StoreUser", async (req, res) => {
  try {
    const { uid, email, name, phone, pincode, house, area, city, state } =
      req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: "Missing uid or email" });
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ uid });

    if (existingUser) {
      const updatedUser = await usersCollection.findOneAndUpdate(
        { uid },
        {
          $set: {
            email,
            name,
            phone,
            pincode,
            house,
            area,
            city,
            state,
          },
        },
        { returnDocument: "after" }
      );

      return res.json({ message: "User updated", user: updatedUser.value });
    }

    // Insert new user
    const newUser = {
      uid,
      email,
      name,
      phone,
      pincode,
      house,
      area,
      city,
      state,
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    res.json({ message: "User stored successfully", user: newUser });
  } catch (error) {
    console.error("Error storing user:", error);
    res.status(500).json({ error: "Failed to store user" });
  }
});

// ===================================================
//                     ADD ORDER API
// ===================================================
// Frontend sends: { uid, orders: [ { productId, quantity, product? } ] }

app.post("/server/ecommerce/AddOrder", async (req, res) => {
  try {
    const { uid, orders } = req.body;

    if (!uid || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: "uid and orders array are required",
      });
    }

    // Build docs for orders collection
    const docs = orders.map((o) => {
      if (!o.productId || !o.quantity) {
        throw new Error("Each order must have productId and quantity");
      }

      return {
        uid,
        productId: o.productId,
        quantity: o.quantity,
        product: o.product || null, // optional snapshot of product
        createdAt: new Date(),
      };
    });

    const result = await ordersCollection.insertMany(docs);

    return res.status(201).json({
      success: true,
      message: "Orders created successfully",
      insertedCount: result.insertedCount,
      orderIds: Object.values(result.insertedIds),
    });
  } catch (err) {
    console.error("AddOrder error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating orders",
    });
  }
});



// ===================================================
//                  REVIEWS MANAGEMENT
// ===================================================

// Get reviews for a product
app.get("/server/ecommerce/GetReviews/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Product ID must be a number" });
    }

    const reviews = await reviewsCollection.find({ productId }).sort({ createdAt: -1 }).toArray();
    res.json(reviews);
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ error: "Failed to retrieve reviews" });
  }
});

// Add a review
app.post("/server/ecommerce/AddReview", async (req, res) => {
  try {
    const { productId, uid, author, rating, title, content, verified } = req.body;

    if (!productId || !author || !rating || !title || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newReview = {
      productId: Number(productId),
      uid: uid || null,
      author,
      rating: Number(rating),
      title,
      content,
      verified: Boolean(verified),
      helpful: 0,
      unhelpful: 0,
      comments: [],
      createdAt: new Date(),
    };

    const result = await reviewsCollection.insertOne(newReview);
    res.status(201).json({ message: "Review added successfully", id: result.insertedId, review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
});

// Update helpful/unhelpful count
app.put("/server/ecommerce/UpdateReviewHelpful/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { type, increment } = req.body; // type: 'helpful' or 'unhelpful', increment: true or false

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const updateField = type === "helpful" ? "helpful" : "unhelpful";
    const updateValue = increment ? 1 : -1;

    const result = await reviewsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { [updateField]: updateValue } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Review updated successfully" });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
});

// Get similar products based on category
app.get("/server/ecommerce/GetSimilarProducts/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Product ID must be a number" });
    }

    // Get current product
    const currentProduct = await productsCollection.findOne({ id: productId });

    if (!currentProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find similar products (same category, exclude current product)
    const similarProducts = await productsCollection
      .find({
        category: currentProduct.category,
        id: { $ne: productId }
      })
      .limit(4)
      .toArray();

    res.json(similarProducts);
  } catch (error) {
    console.error("Error retrieving similar products:", error);
    res.status(500).json({ error: "Failed to retrieve similar products" });
  }
});

app.get("/", (req, res) => {
  res.send("Ecommerce API is running ✅");
});
