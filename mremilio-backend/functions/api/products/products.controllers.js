const firebase_controller = require("../../fb");

const getAllProducts = async () => {
  return await firebase_controller.db
    .collection("products")
    .get()
    .then((data) => data);
};

const getProductById = async (id) => {
  return await firebase_controller.db
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
    area_availability,
  } = product;
  // return await db.collection("products").doc(`/${Date.now()}/`).create({
  return await firebase_controller.db
    .collection("products")
    .doc(`/${product_id}/`)
    .create({
      name,
      description,
      price,
      stock,
      size,
      quantity,
      picture,
      rating,
      product_id,
      area_availability,
    });
};

const updateProduct = async (product, id) => {
  const {
    name,
    description,
    price,
    stock,
    size,
    quantity,
    picture,
    rating,
    area_availability,
  } = product;
  return await firebase_controller.db.collection("products").doc(id).update({
    name,
    description,
    price,
    stock,
    size,
    quantity,
    picture,
    rating,
    area_availability,
  });
};
const deleteProduct = async (id) => {
  return await firebase_controller.db.collection("products").doc(id).delete();
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
