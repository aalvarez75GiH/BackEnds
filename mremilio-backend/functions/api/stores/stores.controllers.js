const firebase_controller = require("../../fb");

const getAllStores = async () => {
  return await firebase_controller.db
    .collection("stores")
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
  console.log(city);
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
      console.log("STORES BY CITY ARRAY:", stores);
      return stores;
    });
};

const createStore = async (store) => {
  const {
    name,
    address,
    work_hour,
    phone_number,
    geometry,
    picture,
    place_id,
    store_id,
    city,
    store_products,
  } = store;
  return await firebase_controller.db
    .collection("stores")
    .doc(`/${store_id}/`)
    .create({
      name,
      address,
      work_hour,
      phone_number,
      geometry,
      picture,
      place_id,
      store_id,
      city,
      store_products,
    });
};

const updateStore = async (store, id) => {
  const {
    name,
    address,
    work_hour,
    phone_number,
    geometry,
    picture,
    place_id,
    store_id,
    city,
    store_products,
  } = store;
  return await firebase_controller.db.collection("stores").doc(id).update({
    name,
    address,
    work_hour,
    phone_number,
    geometry,
    picture,
    place_id,
    store_id,
    city,
    store_products,
  });
};

const deleteStore = async (id) => {
  return await firebase_controller.db.collection("stores").doc(id).delete();
};

module.exports = {
  getAllStores,
  getStoresByCity,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
};
