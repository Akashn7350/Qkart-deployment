import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Grid,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  // const product =
  // {
  // "name":"Tan Leatherette Weekender Duffle",
  // "category":"Fashion",
  // "cost":150,
  // "rating":4,
  // "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  // "_id":"PmInA797xJhMIPti"
  // }
  return (
    <Grid item xs={6} md={4} sm={4}>
      <Card className="card">
        <CardMedia component="img" image={product.image} alt={product.image} />
        <CardContent>
          <div>{product.name}</div>
          <Typography gutterBottom variant="h5" component="div">
            ${product.cost}
          </Typography>
          <Rating value={product.rating} name={product.name} readOnly />
        </CardContent>
        <CardActions>
          <Button
            className="button"
            variant="contained"
            startIcon={<AddShoppingCartOutlined />}
            onClick = {()=>handleAddToCart(localStorage.getItem("token"),[],[],product._id,1)}
          >
            add to cart
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ProductCard;
