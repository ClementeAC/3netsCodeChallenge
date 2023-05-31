import express, { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";

const app = express();
const port = 3000;
const mongoUrl = "mongodb://localhost:27017";
const dbName = "myapp";
const client = new MongoClient(mongoUrl);

app.use(express.json());
app.use(cors());

app.get("/products", async (req: Request, res: Response) => {
  try {
    const collection = client.db(dbName).collection("products");
    const products = await collection.find().toArray();
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const collection = client.db(dbName).collection("products");
    const product = await collection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/products", async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;
    const collection = client.db(dbName).collection("products");
    const result = await collection.insertOne({
      name,
      description,
      price: parseFloat(price),
      reviews: [],
    });

    if (result.acknowledged) {
      res.status(201).json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to create product" });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/products/:id/reviews", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "Invalid rating value" });
      return;
    }

    const collection = client.db(dbName).collection("products");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          reviews: {
            _id: new ObjectId(),
            rating: parseInt(rating),
            comment: comment || "",
          },
        },
      }
    );

    if (result.modifiedCount === 1) {
      res.status(201).json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to add review to product" });
    }
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/reviews", async (req: Request, res: Response) => {
  try {
    const collection = client.db(dbName).collection("products");
    const products = await collection.find().toArray();

    const reviews = products.flatMap((product) => {
      if (product.reviews && Array.isArray(product.reviews)) {
        return product.reviews.map((review: any) => ({
          productId: product._id,
          name: product.name,
          rating: review.rating,
          comment: review.comment,
        }));
      }
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
