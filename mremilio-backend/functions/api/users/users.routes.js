const express = require("express");
const { v4: uuidv4 } = require("uuid");
// const validate = require("uuid-validate");
const usersRouter = express.Router();
// require("dotenv").config();
const usersControllers = require("./users.controllers");
const firebase_controller = require("../../fb");

// usersRouter.post("/", (req, res) => {
//   const raw_token = req.body.ID_token;
//   const stringed_token = JSON.stringify(raw_token);
//   console.log("TOKEN AT SERVER:", stringed_token);

//   firebase_controller.getAuth.verifyIdToken(req.body.ID_token).then((id) => {
//     console.log(id);
//   });
// });
usersRouter.get("/:uid", (req, res) => {
  const uid = req.params.uid;
  (async () => {
    try {
      await usersControllers.getUserByUID(uid).then((user) => {
        console.log(user);
        res.status(200).send(user);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

usersRouter.post("/", (req, res) => {
  const user_id = uuidv4();
  const user = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phone_number: req.body.phone_number,
    role: req.body.role,
    uid: req.body.uid,
    user_id,
    favourites: req.body.favourites,
  };
  console.log("USER AT END POINT:", user);
  (async () => {
    try {
      await usersControllers.createUser(user).then((newUser) => {
        res.status(201).json(newUser);
        // return res.status(201).send({
        //   status: "Success",
        //   msg: "User saved successfully...",
        // });
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

usersRouter.put("/:uid", (req, res) => {
  const uid = req.params.uid;
  const data = {
    name: req.body.name,
    address: req.body.address,
    phone_number: req.body.phone_number,
  };
  (async () => {
    try {
      await usersControllers.updateUser(data, uid).then((shadowUser) => {
        console.log("DATA:", shadowUser);
        res.status(200).json(shadowUser);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "Failed",
        msg: "Something went wrong updating Data...",
      });
    }
  })();
});

module.exports = usersRouter;
