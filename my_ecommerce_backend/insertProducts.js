import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 MongoDB Connected!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const insertProducts = async () => {
  try {
    await Product.insertMany(Product);
    console.log("✅ Products added successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error inserting products:", err);
    mongoose.connection.close();
  }
};

insertProducts();

