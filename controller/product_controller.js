const { ProductModel } = require("../model/product_model");

// Get all products
const getProducts = async (req, res) => {
    const { type, minPrice, maxPrice, sortBy } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (minPrice) filter.price = { $lte: minPrice };
    if (maxPrice) filter.price = {  $gte: maxPrice };
  
    try {
      const products = await ProductModel.find(filter).sort(
        sortBy ? { createdAt: sortBy === "asc" ? 1 : -1 } : {}
      );
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

// Add new product
const addProduct = async (req, res) => {
  const { name, price, image, description } = req.body;
  if (!name || !price || !image || !description) {
    return res.status(400).json({ message: "Please fill all required fieldsssssss" });
  }

  try {
    const product = await ProductModel.create({ name, price, description, image });
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit existing product
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image } = req.body;

  try {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      { name, price, description, image },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addProduct, editProduct, deleteProduct, getProducts };
