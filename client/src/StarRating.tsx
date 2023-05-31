import React from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const handleClick = (selectedRating: number) => {
    onRatingChange(selectedRating);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          onClick={() => handleClick(value)}
          style={{
            color: value <= rating ? "gold" : "gray",
            cursor: "pointer",
          }}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

export default StarRating;
