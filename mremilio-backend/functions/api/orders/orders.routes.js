const express = require("express");
const nanoid = require("nanoid");
const { v4: uuidv4 } = require("uuid");
const validate = require("uuid-validate");

const ordersController = require("./orders.controllers");
const ordersRouter = express.Router();
const warehouseControllers = require("../warehouses/warehouses.controllers");

const validateID = (req, res, next) => {
  let id = req.params.id;
  const validation = validate(id);
  if (!validation) {
    res.status(400).send(`id [${id}] entered is not valid...`);
    return;
  }
  next();
};

ordersRouter.get("/", (req, res) => {
  (async () => {
    try {
      await ordersController.getAllOrders().then((data) => {
        let orders = [];
        let docs = data.docs;
        docs.map((doc) => {
          const selectedOrder = {
            customer: doc.data().customer,
            delivery_type: doc.data().delivery_type,
            order_date: doc.data().order_date,
            order_number: doc.data().order_number,
            order_products: doc.data().order_products,
            order_total: doc.data().order_total,
            payment_information: doc.data().payment_information,
            status: doc.data().status,
            stripe_order_id: doc.data().stripe_order_id,
            warehouse_to_pickup: doc.data().warehouse_to_pickup,
            delivery_time: doc.data().delivery_time,
            order_id: doc.data().order_id,
          };
          //   console.log(selectedOrder);
          orders.push(selectedOrder);
        });
        console.log(orders);
        res.status(200).json(orders);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

ordersRouter.get("/:id", validateID, (req, res) => {
  const id = req.params.id;
  (async () => {
    try {
      await ordersController.getOrderById(id).then((order) => {
        console.log(order);
        res.status(200).send(order);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

ordersRouter.get("/customer/:uid", (req, res) => {
  const uid = req.params.uid;
  //   res.status(200).send(uid);
  (async () => {
    try {
      await ordersController.getOrderByCustomerUID(uid).then((data) => {
        // console.log("DATA:", data);
        res.status(200).json(data);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

ordersRouter.get("/customer/email/:email", (req, res) => {
  const email = req.params.email;
  //   res.status(200).send(uid);
  (async () => {
    try {
      await ordersController.getOrderByCustomerEmail(email).then((data) => {
        // console.log("DATA:", data);
        res.status(200).json(data);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

ordersRouter.get("/customer/phone/:phone", (req, res) => {
  const phone_number = req.params.phone;
  console.log("PHONE NUMBER:", phone_number);
  (async () => {
    try {
      await ordersController
        .getOrderByCustomerPhoneNumber(phone_number)
        .then((data) => {
          // console.log("DATA:", data);
          res.status(200).json(data);
        });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

ordersRouter.get("/order_number/:order_number", (req, res) => {
  const order_number = req.params.order_number;
  console.log("ORDER NUMBER:", order_number);
  (async () => {
    try {
      await ordersController
        .getOrderByCustomerOrderNumber(order_number)
        .then((data) => {
          // console.log("DATA:", data);
          res.status(200).json(data);
        });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

const handlingProductsQuantity = async (data) => {
  (async () => {
    try {
      const products =
        await warehouseControllers.updateProductsQuantityAtWarehouse(
          data.warehouse,
          data.order_products
        );
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: "Something went wrong updating Quantity of products at waerehouse",
      });
    }
  })();
};

ordersRouter.post("/", (req, res) => {
  // Generating Order number
  const randomOrderNumber = Math.floor(100000 + Math.random() * 900000);
  const order_number = `ME-${randomOrderNumber.toString()}`;
  // console.log(order_number);

  // Generating Order Document Id
  const order_id = uuidv4();

  const dataToQuantity = {
    warehouse: req.body.warehouse_to_pickup,
    order_products: req.body.order_products,
  };

  const order = {
    customer: req.body.customer,
    delivery_type: req.body.delivery_type,
    delivery_time: req.body.delivery_time,
    order_date: req.body.order_date,
    order_products: req.body.order_products,
    order_total: req.body.order_total,
    payment_information: req.body.payment_information,
    status: req.body.status,
    stripe_order_id: req.body.stripe_order_id,
    warehouse_to_pickup: req.body.warehouse_to_pickup,
    order_id,
  };

  Object.assign(order, { order_number: order_number });

  const response = handlingProductsQuantity(dataToQuantity);

  // console.log("ORDER WITH NUMBER:", order);
  (async () => {
    try {
      await ordersController.createOrder(order).then(() => {
        return res.status(201).json(order);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "Failed",
        msg: "Something went wrong saving Data...",
      });
    }
  })();
});

ordersRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const order = {
    customer: req.body.customer,
    delivery_type: req.body.delivery_type,
    delivery_time: req.body.delivery_time,
    order_date: req.body.order_date,
    order_number: req.body.order_number,
    order_products: req.body.order_products,
    order_total: req.body.order_total,
    payment_information: req.body.payment_information,
    status: req.body.status,
    stripe_order_id: req.body.stripe_order_id,
    warehouse_to_pickup: req.body.warehouse_to_pickup,
  };
  (async () => {
    try {
      await ordersController.updateOrder(order, id).then(() => {
        return res.status(201).send({
          status: "Success",
          msg: "Order updated successfully...",
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "Failed",
        msg: "Something went wrong saving Data...",
      });
    }
  })();
});

ordersRouter.put("/order_status/:id", (req, res) => {
  const id = req.params.id;
  const order = {
    status: req.body.status,
  };
  (async () => {
    try {
      await ordersController.updateOrderStatus(order, id).then(() => {
        return res.status(201).send({
          status: "Success",
          msg: "Order updated successfully...",
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "Failed",
        msg: "Something went wrong saving Data...",
      });
    }
  })();
});

ordersRouter.delete("/", (req, res) => {
  (async () => {
    try {
      await ordersController.deleteAllOrder().then(() => {
        return res.status(200).send({
          status: "Success",
          msg: "Orders deleted successfully...",
        });
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

ordersRouter.delete("/:id", validateID, (req, res) => {
  const id = req.params.id;
  (async () => {
    try {
      await ordersController.deleteOrder(id).then(() => {
        return res.status(200).send({
          status: "Success",
          msg: "Order deleted successfully...",
        });
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

module.exports = ordersRouter;
