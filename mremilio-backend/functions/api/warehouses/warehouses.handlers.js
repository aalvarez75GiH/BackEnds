const arrayingWarehouses = (data) => {
  let warehouses = [];
  let docs = data.docs;
  docs.map((doc) => {
    const selectedWarehouse = {
      name: doc.data().name,
      address: doc.data().address,
      openingTime: doc.data().openingTime,
      closingTime: doc.data().closingTime,
      geometry: doc.data().geometry,
      picture: doc.data().picture,
      max_limit_ratio_pickup: doc.data().max_limit_ratio_pickup,
      max_limit_ratio_delivery: doc.data().max_limit_ratio_delivery,
      max_delivery_time: doc.data().max_delivery_time,
      warehouse_id: doc.data().warehouse_id,
      products: doc.data().products,
      phone_number: doc.data().phone_number,
      city: doc.data().city,
      representative: doc.data().representative,
      active: doc.data().active,
    };
    // console.log(selectedWarehouse);
    if (selectedWarehouse.active) {
      warehouses.push(selectedWarehouse);
    }
  });
  return warehouses;
};

const arrayingWarehousesForAdmin = (data) => {
  let warehouses = [];
  let docs = data.docs;
  docs.map((doc) => {
    const selectedWarehouse = {
      name: doc.data().name,
      address: doc.data().address,
      openingTime: doc.data().openingTime,
      closingTime: doc.data().closingTime,
      geometry: doc.data().geometry,
      picture: doc.data().picture,
      max_limit_ratio_pickup: doc.data().max_limit_ratio_pickup,
      max_limit_ratio_delivery: doc.data().max_limit_ratio_delivery,
      max_delivery_time: doc.data().max_delivery_time,
      warehouse_id: doc.data().warehouse_id,
      products: doc.data().products,
      phone_number: doc.data().phone_number,
      city: doc.data().city,
      representative: doc.data().representative,
      active: doc.data().active,
    };
    warehouses.push(selectedWarehouse);
  });
  return warehouses;
};

module.exports = {
  arrayingWarehousesForAdmin,
  arrayingWarehouses,
};
