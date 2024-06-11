const express = require("express");
const {
  addProduct,
  editProduct,
  deleteProduct,
  getProducts,
} = require("../controller/product_controller");

// const authorization = require('../middleware/authorization')

const productRouter = express.Router();

productRouter.post("/add", addProduct);
productRouter.put("/edit/:id", editProduct);
productRouter.delete("/delete/:id", deleteProduct);
productRouter.get("/", getProducts);

module.exports = { productRouter };
