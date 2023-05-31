"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
const mongoUrl = "mongodb://localhost:27017";
const dbName = "myapp";
const client = new mongodb_1.MongoClient(mongoUrl);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = client.db(dbName).collection("products");
        const products = yield collection.find().toArray();
        res.json(products);
    }
    catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.get("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const collection = client.db(dbName).collection("products");
        const product = yield collection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!product) {
            res.status(404).json({ error: "Product not found" });
        }
        else {
            res.json(product);
        }
    }
    catch (error) {
        console.error("Error retrieving product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price } = req.body;
        const collection = client.db(dbName).collection("products");
        const result = yield collection.insertOne({
            name,
            description,
            price: parseFloat(price),
            reviews: [],
        });
        if (result.acknowledged) {
            res.status(201).json({ success: true });
        }
        else {
            res.status(500).json({ error: "Failed to create product" });
        }
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/products/:id/reviews", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        if (rating < 1 || rating > 5) {
            res.status(400).json({ error: "Invalid rating value" });
            return;
        }
        const collection = client.db(dbName).collection("products");
        const result = yield collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $push: {
                reviews: {
                    _id: new mongodb_1.ObjectId(),
                    rating: parseInt(rating),
                    comment: comment || "",
                },
            },
        });
        if (result.modifiedCount === 1) {
            res.status(201).json({ success: true });
        }
        else {
            res.status(500).json({ error: "Failed to add review to product" });
        }
    }
    catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.get("/reviews", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = client.db(dbName).collection("products");
        const products = yield collection.find().toArray();
        const reviews = products.flatMap((product) => {
            if (product.reviews && Array.isArray(product.reviews)) {
                return product.reviews.map((review) => ({
                    productId: product._id,
                    name: product.name,
                    rating: review.rating,
                    comment: review.comment,
                }));
            }
        });
        res.json(reviews);
    }
    catch (error) {
        console.error("Error retrieving reviews:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
client
    .connect()
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
});
