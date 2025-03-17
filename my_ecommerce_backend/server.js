import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import fs from 'fs-extra';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ 
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true 
}));

app.use(express.json()); 

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 MongoDB Connected!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Hello, Backend is running! 🚀");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); 
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
});

app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body); 
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to add product", error });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cacheImagePath = path.join(
      process.cwd(),
      "../my-ecommerce-frontend/.next/cache/images",
      path.basename(product.imageUrl) 
    );

    if (fs.existsSync(cacheImagePath)) {
      await fs.remove(cacheImagePath); 
      console.log(`🗑️ Image deleted from cache: ${cacheImagePath}`);
    }

    res.status(200).json({ message: "Product and image deleted successfully hahah" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
});

app.put("/products/:id", async (req, res) => {
  app.put("/products/:id", async (req, res) => {
    try {
      console.log(`🛠️ Updating product ${req.params.id} with data:`, req.body); // Debugging Log
  
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedProduct) {
        console.log("❌ Product not found for update");
        return res.status(404).json({ message: "Product not found" });
      }
  
      console.log("✅ Product updated successfully:", updatedProduct);
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("❌ Failed to update product:", error);
      res.status(500).json({ message: "Failed to update product", error });
    }
  });
   try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,      
      req.body,            
      {
        new: true,         
        runValidators: true 
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct); 
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
