import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"], 
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"], 
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
