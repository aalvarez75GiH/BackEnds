const express = require("express");
const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");
const usersController = require("./users.controller");
const usersRouter = express.Router();
// const { getAllUsers } = require("./users.controller");

// ************* Firebase configuration
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const db = admin.firestore();
// *************************************

// fetch - all Data Details from firestore
usersRouter.get("/", (req, res) => {
  (async () => {
    try {
      await usersController.getAllUsers().then((data) => {
        let response = [];
        let docs = data.docs;
        docs.map((doc) => {
          const selectedItem = {
            name: doc.data().name,
            mobile: doc.data().mobile,
            address: doc.data().address,
          };
          console.log(selectedItem);
          response.push(selectedItem);
        });
        console.log(response);
        res.status(200).send(response);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

usersRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  (async () => {
    try {
      await usersController.getUserById(id).then((response) => {
        console.log("RESPONSE:", response);
        res.status(200).send(response);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

usersRouter.post("/create", (req, res) => {
  const user = {
    name: req.body.name,
    mobile: req.body.mobile,
    address: req.body.address,
  };
  (async () => {
    try {
      await usersController.createUser(user).then(() => {
        return res.status(201).send({
          status: "Success",
          msg: "Data saved successfully...",
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

usersRouter.put("/update/:id", (req, res) => {
  const id = req.params.id;

  const user = {
    name: req.body.name,
    mobile: req.body.mobile,
    address: req.body.address,
  };

  (async () => {
    try {
      await usersController.updateUser(user, id).then(() => {
        return res.status(200).send({
          status: "Success",
          msg: "Data updated successfully...",
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

usersRouter.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  (async () => {
    try {
      await usersController.deleteUser(id).then(() => {
        return res.status(200).send({
          status: "Success",
          msg: "Data deleted successfully...",
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
module.exports = usersRouter;
