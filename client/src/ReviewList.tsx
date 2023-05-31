import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Typography, Card, CardContent, Box, IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface Review {
  name: string;
  productId: string;
  rating: number;
  comment: string;
}

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:3000/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("Error retrieving reviews: ", error);
    }
  };

  return (
    <div>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ paddingTop: "20px" }}
      >
        All Reviews
      </Typography>
      {reviews.length > 0 ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {reviews.map((review) => (
            <Link
              key={review.productId}
              to={`/products/${review.productId}`}
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
                  <Typography variant="h5">{review.name}</Typography>
                  <Typography variant="body1">
                    <b>Rating: </b> {review.rating}
                  </Typography>
                  <Typography>
                    <b>Comment: </b> {review.comment}
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
        <Typography variant="body1">No reviews available.</Typography>
      )}
    </div>
  );
};

export default ReviewList;
