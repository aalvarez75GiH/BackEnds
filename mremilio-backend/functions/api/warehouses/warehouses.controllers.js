const db = require("../../fb");

const getAllWarehouses = async () => {
  return await db
    .collection("warehouses")
    .get()
    .then((data) => data);
};

const getWarehouseById = async (id) => {
  return await db
    .collection("warehouses")
    .doc(id)
    .get()
    .then((warehouse) => warehouse.data());
};

const createWarehouse = async (warehouse) => {
  const {
    name,
    address,
    work_hour,
    geometry,
    picture,
    max_limit_ratio_pickup,
    max_limit_ratio_delivery,
    warehouse_id,
  } = warehouse;
  return await db.collection("warehouses").doc(`/${warehouse_id}/`).create({
    id: Date.now(),
    name,
    address,
    work_hour,
    geometry,
    picture,
    max_limit_ratio_pickup,
    max_limit_ratio_delivery,
    warehouse_id,
  });
};

const updateWarehouse = async (warehouse, id) => {
  const {
    name,
    geometry,
    work_hour,
    address,
    max_limit_ratio_pickup,
    max_limit_ratio_delivery,
    picture,
  } = warehouse;
  return await db.collection("warehouses").doc(id).update({
    name,
    geometry,
    work_hour,
    address,
    max_limit_ratio_pickup,
    max_limit_ratio_delivery,
    picture,
  });
};
const deleteWarehouse = async (id) => {
  return await db.collection("warehouses").doc(id).delete();
};

module.exports = {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};

// [

//   {
//       "name": "Mr Emilio Store - Winder",
//       "address": "79 E Athens St, Winder, GA 30680",
//       "work_hour": "9:00 am - 10:00 pm",
//       "geometry": {
//           "location": {
//               "lat": 33.99142934065858,
//               "lng": -83.71976174174195
//           }
//       },
//       "picture": "",
//       "max_limit_ratio_pickup": 32186.9,
//       "max_limit_ratio_delivery": 32186.9
//   }
// ]