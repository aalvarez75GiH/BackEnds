const firebase_controller = require("../../fb");

const getAllWarehouses = async () => {
  return await firebase_controller.db
    .collection("warehouses")
    .get()
    .then((data) => data);
};

const getWarehouseById = async (id) => {
  return await firebase_controller.db
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
    max_delivery_time,
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
    max_delivery_time,
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
    max_delivery_time,
    picture,
  } = warehouse;
  return await firebase_controller.db.collection("warehouses").doc(id).update({
    name,
    geometry,
    work_hour,
    address,
    max_limit_ratio_pickup,
    max_limit_ratio_delivery,
    max_delivery_time,
    picture,
  });
};
const deleteWarehouse = async (id) => {
  return await firebase_controller.db.collection("warehouses").doc(id).delete();
};

module.exports = {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
