const firebase_controller = require("../../fb");

const getAllOrders = async () => {
  return await firebase_controller.db
    .collection("orders")
    .get()
    .then((data) => data);
};

const getOrderById = async (id) => {
  return await firebase_controller.db
    .collection("orders")
    .doc(id)
    .get()
    .then((order) => order.data());
};

const getOrderByCustomerUID = async (uid) => {
  console.log(uid);
  let orders = [];
  return await firebase_controller.db
    .collection("orders")
    .where(`customer.uid`, "==", uid)
    .get()
    // .then((orders) => orders.data());
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        orders.push(doc.data());
      });
      console.log("ORDERS BY ID ARRAY:", orders);
      return orders;
    });
};

const getOrderByCustomerEmail = async (email) => {
  console.log(email);
  let orders = [];
  return await firebase_controller.db
    .collection("orders")
    .where(`customer.email`, "==", email)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        orders.push(doc.data());
      });
      console.log("ORDERS BY EMAIL ARRAY:", orders);
      return orders;
    });
};

const getOrderByCustomerPhoneNumber = async (phone_number) => {
  console.log(phone_number);
  let orders = [];
  return await firebase_controller.db
    .collection("orders")
    .where(`customer.phone_number`, "==", phone_number)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        orders.push(doc.data());
      });
      console.log("ORDERS BY PHONE NUMBER ARRAY:", orders);
      return orders;
    });
};
const getOrderByCustomerOrderNumber = async (order_number) => {
  console.log(order_number);
  let orders = [];
  return await firebase_controller.db
    .collection("orders")
    .where(`order_number`, "==", order_number)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        orders.push(doc.data());
      });
      console.log("ORDER BY ORDER NUMBER ARRAY:", orders);
      return orders;
    });
};

const getOrdersByWarehouseID = async (warehouse_id) => {
  console.log("WAREHOUSE ID AT CONTROLLER:", warehouse_id);
  let orders = [];
  return await firebase_controller.db
    .collection("orders")
    .where(`warehouse_to_pickup.warehouse_id`, "==", warehouse_id)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        orders.push(doc.data());
      });
      console.log("ORDER BY ORDER NUMBER ARRAY:", orders);
      return orders;
    });
};

// var firebase_controller.db = firebase.firestore();
//     var query = firebase_controller.db.collection('orders').where("customer", "==", { uid: "xyz", userName: "abc" });

const createOrder = async (order) => {
  const {
    customer,
    delivery_type,
    delivery_time,
    order_date,
    order_number,
    order_products,
    order_total,
    payment_information,
    status,
    stripe_order_id,
    warehouse_to_pickup,
    order_id,
  } = order;
  return await firebase_controller.db
    .collection("orders")
    .doc(`/${order_id}/`)
    .create({
      customer,
      delivery_type,
      delivery_time,
      order_date,
      order_number,
      order_products,
      order_total,
      payment_information,
      status,
      stripe_order_id,
      warehouse_to_pickup,
      order_id,
    });
};

const updateOrder = async (order, id) => {
  const {
    customer,
    delivery_type,
    delivery_time,
    order_date,
    order_number,
    order_products,
    order_total,
    payment_information,
    status,
    stripe_order_id,
    warehouse_to_pickup,
  } = order;
  return await firebase_controller.db.collection("orders").doc(id).update({
    customer,
    delivery_type,
    delivery_time,
    order_date,
    order_number,
    order_products,
    order_total,
    payment_information,
    status,
    stripe_order_id,
    warehouse_to_pickup,
  });
};

const updateOrderStatus = async (order, id) => {
  const { status } = order;
  return await firebase_controller.db.collection("orders").doc(id).update({
    status,
  });
};

const deleteOrder = async (id) => {
  return await firebase_controller.db.collection("orders").doc(id).delete();
};
const deleteAllOrder = async () => {
  return await firebase_controller.db
    .collection("orders")
    .listDocuments()
    .then((val) => {
      val.map((val) => {
        val.delete();
      });
    });
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderByCustomerEmail,
  getOrderByCustomerUID,
  createOrder,
  updateOrder,
  deleteOrder,
  deleteAllOrder,
  updateOrderStatus,
  getOrderByCustomerPhoneNumber,
  getOrderByCustomerOrderNumber,
  getOrdersByWarehouseID,
};
