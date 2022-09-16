const functions = require("firebase-functions");
const productsRouter = require("./api/products/products.routes");
const warehousesRouter = require("./api/warehouses/warehouses.routes");
const paymentsRouter = require("./api/payments/payments.routes");
const companyRouter = require("./api/company/company.routes");
const ordersRouter = require("./api/orders/orders.routes");
const storesRouter = require("./api/stores/stores.routes");
const usersRouter = require("./api/users/users.routes");
// ********** express configuration
const express = require("express");
const app = express();

// ********** Cors configuration
const cors = require("cors");
app.use(
  cors({
    origin: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to Mr Emilio backEnd");
});

// ******************* Routes *******************
app.use("/api/products", productsRouter);
app.use("/api/warehouses", warehousesRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/company", companyRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/stores", storesRouter);
app.use("/api/users", usersRouter);
// ******************* Routes (END) *******************

exports.app = functions.https.onRequest(app);
