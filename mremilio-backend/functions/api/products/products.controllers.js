const db = require("../../fb");

const getAllProducts = async () => {
  return await db
    .collection("products")
    .get()
    .then((data) => data);
};

const getProductById = async (id) => {
  return await db
    .collection("products")
    .doc(id)
    .get()
    .then((product) => product.data());
};

const createProduct = async (product) => {
  const {
    name,
    description,
    price,
    stock,
    size,
    quantity,
    picture,
    rating,
    product_id,
  } = product;
  // return await db.collection("products").doc(`/${Date.now()}/`).create({
  return await db.collection("products").doc(`/${product_id}/`).create({
    name,
    description,
    price,
    stock,
    size,
    quantity,
    picture,
    rating,
    product_id,
  });
};

const updateProduct = async (product, id) => {
  const { name, description, price, stock, size, quantity, picture, rating } =
    product;
  return await db.collection("products").doc(id).update({
    name,
    description,
    price,
    stock,
    size,
    quantity,
    picture,
    rating,
  });
};
const deleteProduct = async (id) => {
  return await db.collection("products").doc(id).delete();
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
