import Product from "../models/Product.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    console.log("Received product creation request");
    // console.log("Body:", req.body); // Commented out to avoid cluttering logs with base64 image

    const { name, description, price, image, category, sellerId } = req.body;

    if (!sellerId) {
        console.error("Error: Missing sellerId");
        return res.status(400).json({ error: "Missing sellerId" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category,
      seller: sellerId, 
    });

    const savedProduct = await newProduct.save();
    console.log("Product saved successfully:", savedProduct._id);
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Get products by a specific seller
export const getMyProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Getting products for sellerId:", userId);
    
    const products = await Product.find({ seller: userId }).sort({ createdAt: -1 });
    console.log(`Found ${products.length} products for seller ${userId}`);
    
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Request to delete product:", id);
    
    await Product.findByIdAndDelete(id);
    console.log("Product deleted from DB:", id);
    
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
