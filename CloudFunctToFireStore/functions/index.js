const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// var serviceAccount = require("./serviceAccountKey.json");
const express = require("express");
const usersRouter = require("./api/resources/users/users.routes");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const db = admin.firestore();

const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: true,
  })
);

app.get("/", (req, res) => {
  return res.status(200).send("Hello from Express");
});

// Routes
app.use("/api/users", usersRouter);

exports.app = functions.https.onRequest(app);
