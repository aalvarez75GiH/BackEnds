const firebase_controller = require("../../fb");

const getAllStores = async () => {
  return await firebase_controller.db
    .collection("stores")
    .get()
    .then((data) => data);
};

const getAllStores_pics = async () => {
  return await firebase_controller.db
    .collection("stores_pictures")
    .get()
    .then((data) => data);
};

const getStoreById = async (id) => {
  return await firebase_controller.db
    .collection("stores")
    .doc(id)
    .get()
    .then((store) => store.data());
};

const getStoresByCity = async (city) => {
  let stores = [];
  return await firebase_controller.db
    .collection("stores")
    .where(`city`, "==", city)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        stores.push(doc.data());
      });
      return stores;
    });
};

const createStore = async (store) => {
  const {
    name,
    address,
    phone_number,
    geometry,
    picture,
    store_id,
    city,
    store_products,
    openingTime,
    closingTime,
  } = store;
  return await firebase_controller.db
    .collection("stores")
    .doc(`/${store_id}/`)
    .create({
      name,
      address,
      phone_number,
      geometry,
      picture,
      store_id,
      city,
      store_products,
      openingTime,
      closingTime,
    });
};
const createStorePicture = async (store_picture) => {
  const { picture, picture_id } = store_picture;
  // return await db.collection("products").doc(`/${Date.now()}/`).create({
  return await firebase_controller.db
    .collection("stores_pictures")
    .doc(`/${picture_id}/`)
    .create({
      picture_id,
      picture,
    });
};

const updateStore = async (store, id) => {
  const {
    name,
    address,
    // work_hour,
    phone_number,
    geometry,
    picture,
    store_id,
    city,
    store_products,
    openingTime,
    closingTime,
  } = store;
  return await firebase_controller.db.collection("stores").doc(id).update({
    name,
    address,
    // work_hour,
    phone_number,
    geometry,
    picture,
    store_id,
    city,
    store_products,
    openingTime,
    closingTime,
  });
};

const deleteStore = async (id) => {
  return await firebase_controller.db.collection("stores").doc(id).delete();
};

module.exports = {
  getAllStores,
  getAllStores_pics,
  getStoresByCity,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  createStorePicture,
};
