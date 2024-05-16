const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());

const CONNECTION_STRING = "mongodb://0.0.0.0:27017/";
const dbname = "ecommerce";
let database;

app.listen(2500, () => {
  MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      console.error('Failed to connect to MongoDB:', error);
    } else {
      database = client.db(dbname);
      console.log("Connected Successfully");
    }
  });
});

app.use(express.json()); 

app.get('/server/ecommerce/GetCartItems', (request, response) => {
    database.collection("ecommercec").find({}).toArray((error, result) => {
      if (error) {
        console.error('Error retrieving cart items:', error);
        response.status(500).json({ error: 'Failed to retrieve cart items' });
      } else {
        response.json(result);
      }
    });
  });
  

app.post('/server/ecommerce/AddToCart', (request, response) => {
    const { productId, quantity, product } = request.body;
    database.collection("ecommercec").insertOne({
      productId: productId,
      quantity: quantity,
      product: product
    }, (error, result) => {
      if (error) {
        console.error('Error adding to cart:', error);
        response.status(500).json({ error: 'Failed to add to cart' });
      } else {
        response.json("Added to cart successfully");
      }
    });
  });
  

app.delete('/server/ecommerce/DeleteCartItem', (request, response) => {
    const id = request.query.id;
    database.collection("ecommercec").deleteOne({ _id: ObjectId(id) }, (error, result) => {
        if (error) {
            console.error('Error deleting cart item:', error);
            response.status(500).json({ error: 'Failed to delete cart item' });
        } else {
            if (result.deletedCount === 1) {
                response.json("Deleted Successfully");
            } else {
                response.status(404).json({ error: 'Cart item not found' });
            }
        }
    });
});
