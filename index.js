const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4f4qc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("babyIsland");
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders");
        const reviewCollection = database.collection("review");

        // GET API -for all products
        app.get("/all", async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // GET API -for ordered products
        app.get("/allorders", async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        // GET API -for products on homepage
        app.get("/homeproduct", async (req, res) => {
            const cursor = productsCollection.find({}).limit(6);
            const products = await cursor.toArray();
            res.send(products);
        });
        // GET API -for one product
        app.get("/buy/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);
        });
        // GET API -for orders on dashboard
        app.get("/myorders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { userName: (id) };
            const cursor = await ordersCollection.find(query);
            const products = await cursor.toArray();
            res.json(products);
        });
        // GET API -for reviews
        app.get("/reviews", async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        // POST API -order
        app.post("/order", async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });
        // POST API -add review
        app.post("/addreview", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        });
        // POST API -add new product
        app.post("/addnew", async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result);
        });
        // DELETE API
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server running");
});

app.listen(port, () => {
    console.log("Running server on", port);
});
