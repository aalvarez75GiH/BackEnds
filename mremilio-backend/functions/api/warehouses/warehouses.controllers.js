const firebase_controller = require("../../fb");

const getAllWarehouses = async () => {
  return await firebase_controller.db
    .collection("warehouses")
    .get()
    .then((data) => data);
};

const getAllWarehouses_pics = async () => {
  return await firebase_controller.db
    .collection("warehouses_pictures")
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
const getWarehouseByIdReturningProducts = async (id) => {
  return await firebase_controller.db
    .collection("warehouses")
    .doc(id)
    .get()
    .then((warehouse) => warehouse.data().products);
};

const createWarehouse = async (warehouse) => {
  const {
    name,
    address,
    geometry,
    picture,
    max_limit_ratio_pickup,
    max_limit_ratio_delivery,
    max_delivery_time,
    warehouse_id,
    products,
    city,
    openingTime,
    closingTime,
    phone_number,
    representative,
    active,
  } = warehouse;
  return await firebase_controller.db
    .collection("warehouses")
    .doc(`/${warehouse_id}/`)
    .create({
      name,
      address,
      geometry,
      picture,
      max_limit_ratio_pickup,
      max_limit_ratio_delivery,
      max_delivery_time,
      warehouse_id,
      products,
      city,
      openingTime,
      closingTime,
      phone_number,
      representative,
      active,
    });
};

const createWarehousePicture = async (warehouse_picture) => {
  const { picture, picture_id } = warehouse_picture;
  // return await db.collection("products").doc(`/${Date.now()}/`).create({
  return await firebase_controller.db
    .collection("warehouses_pictures")
    .doc(`/${picture_id}/`)
    .create({
      picture_id,
      picture,
    });
};

const updateWarehouse = async (warehouse, id) => {
  console.log("WAREHOUSE ID AT CONTROLLER:", warehouse.warehouse_id);
  console.log("WAREHOUSE NAME AT CONTROLLER:", warehouse.name);
  console.log("WAREHOUSE PRODUCTS AT CONTROLLER:", warehouse.products);
  console.log("WAREHOUSE AT CONTROLLER:", warehouse);
  const {
    name,
    geometry,
    address,
    max_limit_ratio_pickup,
    max_limit_ratio_delivery,
    max_delivery_time,
    picture,
    products,
    phone_number,
    openingTime,
    closingTime,
    city,
    representative,
    active,
  } = warehouse;
  await firebase_controller.db.collection("warehouses").doc(id).update({
    name,
    geometry,
    address,
    max_limit_ratio_pickup,
    max_limit_ratio_delivery,
    max_delivery_time,
    picture,
    products,
    phone_number,
    openingTime,
    closingTime,
    city,
    representative,
    active,
  });
  console.log("WAREHOUSE UPDATED SUCCESSFULLY...");
};

const updateProductsQuantityAtWarehouse = async (warehouse, order_products) => {
  console.log("WAREHOUSE_PRODUCTS:", warehouse.products);
  console.log("ORDER_PRODUCTS:", order_products);
  let warehouse_products = warehouse.products;

  const new_array = warehouse_products.map((element, index) => {
    order_products.map((order_product) => {
      if (order_product.product_id === element.product_id) {
        element.stock = element.stock - order_product.quantity;
      }
    });
    return element;
  });
  console.log("NEW ARRAY:", new_array);

  await firebase_controller.db
    .collection("warehouses")
    .doc(warehouse.warehouse_id)
    .update({
      products: new_array,
    });
};

const deleteWarehouse = async (id) => {
  return await firebase_controller.db.collection("warehouses").doc(id).delete();
};

module.exports = {
  getAllWarehouses,
  getWarehouseById,
  getWarehouseByIdReturningProducts,
  createWarehouse,
  updateWarehouse,
  updateProductsQuantityAtWarehouse,
  deleteWarehouse,
  createWarehousePicture,
  getAllWarehouses_pics,
};
