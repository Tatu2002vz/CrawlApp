const Product = require("../models/product");
const getAllProducts = (async (req, res) => {
  const allProduct = await Product.find().sort("createdAt");
  return res.status(statusCode.OK).json({
    mes: allProduct,
  });
});

const addProduct = (async (data) => {
  // const {name, price, image, description, link, workerId} = data;
  const product = await Product.create(data);
  if (!product)
    return false;
  return true;
});

const addProductAPI = (async (req, res) => {
  // const {name, price, image, description, link, workerId} = data;
  const product = await Product.create(req.body);
  if (!product)
    return false;
  return true;
});

module.exports = {
  getAllProducts,
  addProduct,
  addProductAPI
};
