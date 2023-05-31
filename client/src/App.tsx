import React, { useState, useEffect, FormEvent } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import axios from "axios";
import StarRating from "./StarRating";
import ReviewList from "./ReviewList";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import theme from "./theme";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Navbar from "./NavBar";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  reviews: Review[];
  rating: number;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
}

function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const productId = window.location.pathname.split("/").pop() || "";

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/products/${productId}`
      );
      setProduct(response.data);
    } catch (error) {
      console.error("Error retrieving product:", error);
    }
  };

  const addReview = async () => {
    try {
      await axios.post(`http://localhost:3000/products/${productId}/reviews`, {
        rating,
        comment,
      });
      fetchProduct();
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ paddingTop: "20px" }}
      >
        Product Details
      </Typography>
      <Typography variant="h5" gutterBottom sx={{ marginTop: "30px" }}>
        <b>Product Name: </b> {product.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <b>Description: </b>
        {product.description}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ marginBottom: "20px" }}>
        <b>Price:</b> ${product.price}
      </Typography>
      <Typography variant="h4" gutterBottom sx={{ marginTop: "20px" }}>
        Add Review
      </Typography>
      <Box display="flex" alignItems="center" gap={2}>
        <StarRating rating={rating} onRatingChange={setRating} />
        <TextField
          type="text"
          label="comment"
          value={comment}
          variant="outlined"
          size="small"
          onChange={(e) => setComment(e.target.value)}
        />
      </Box>
      <Button
        variant="contained"
        onClick={addReview}
        sx={{ marginRight: 2, marginTop: "20px" }}
      >
        Submit Review
      </Button>
      <Typography variant="h4" gutterBottom sx={{ marginTop: "30px" }}>
        Reviews
      </Typography>
      {product.reviews.length === 0 ? (
        <Typography variant="body1" gutterBottom>
          No reviews yet.
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {product.reviews.map((review) => (
            <Card key={review._id} variant="outlined">
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  <b>Rating:</b> {review.rating}/5
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {review.comment || "No Comment Provided."}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </div>
  );
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(
        "http://localhost:3000/products"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error retrieving products:", error);
    }
  };

  const createProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/products", {
        name: productName,
        description: productDescription,
        price: productPrice,
      });
      fetchProducts();
      setProductName("");
      setProductDescription("");
      setProductPrice("");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div>
      <div style={{ paddingBottom: "15px" }}>
        <Typography variant="h4" component="h4" sx={{ paddingTop: "20px" }}>
          Create Product
        </Typography>
      </div>
      <form onSubmit={createProduct} style={{ paddingBottom: "10px" }}>
        <Box display="flex" flexDirection="row" gap={2}>
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            size="small"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
          <TextField
            label="Price"
            variant="outlined"
            size="small"
            type="number"
            inputProps={{ step: "any" }}
            value={productPrice}
            required
            onChange={(e) => setProductPrice(e.target.value)}
          />
          <Button type="submit" variant="outlined" size="medium">
            Create
          </Button>
        </Box>
      </form>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ paddingTop: "20px" }}
      >
        Products
      </Typography>
      {products.length > 0 ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textDecoration: "none",
                }}
              >
                <CardContent>
                  <Typography variant="h5">{product.name}</Typography>
                  <Typography variant="body1">
                    <b>Description: </b> {product.description}
                  </Typography>
                  <Typography>
                    <b>Ratings: </b> {product.reviews.length}
                  </Typography>
                </CardContent>
                <IconButton>
                  <ChevronRightIcon />
                </IconButton>
              </Card>
            </Link>
          ))}
        </Box>
      ) : (
        <Typography variant="body1">No Products available.</Typography>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/reviews" element={<ReviewList />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
