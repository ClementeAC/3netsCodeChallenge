import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button, AppBar, Toolbar } from "@mui/material";

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          Product Management
        </Typography>
        <div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginRight: 2 }}
            >
              View All Products
            </Button>
          </Link>
          <Link to="/reviews" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="secondary">
              View All Reviews
            </Button>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
