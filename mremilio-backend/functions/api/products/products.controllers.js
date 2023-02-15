const firebase_controller = require("../../fb");

const getAllProducts = async () => {
  return await firebase_controller.db
    .collection("products")
    .get()
    .then((data) => data);
};
const getAllProducts_pics = async () => {
  return await firebase_controller.db
    .collection("products_pictures")
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
  await firebase_controller.db
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
  return product;
};

const createProductPicture = async (product_picture) => {
  const { picture, picture_id } = product_picture;
  // return await db.collection("products").doc(`/${Date.now()}/`).create({
  return await firebase_controller.db
    .collection("products_pictures")
    .doc(`/${picture_id}/`)
    .create({
      picture_id,
      picture,
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

const updateProductPicture = async (product_picture) => {
  console.log("PRODUCT_PICTURE:", product_picture);
  const { picture, picture_id } = product_picture;
  console.log("URL:", url);
  console.log("PICTURE_ID:", picture_id);
  // return await db.collection("products").doc(`/${Date.now()}/`).create({
  return await firebase_controller.db
    .collection("products_pictures")
    .doc(`/${picture_id}/`)
    .update({
      picture_id,
      picture,
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
  getAllProducts_pics,
  createProductPicture,
  updateProductPicture,
};
