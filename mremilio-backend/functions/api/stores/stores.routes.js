const express = require("express");
const { v4: uuidv4 } = require("uuid");
const validate = require("uuid-validate");
const storesRouter = express.Router();
require("dotenv").config();
const storesControllers = require("./stores.controllers");

const validateID = (req, res, next) => {
  let id = req.params.id;
  const validation = validate(id);
  if (!validation) {
    res.status(400).send(`id [${id}] entered is not valid...`);
    return;
  }
  next();
};
const arrayingStores = (data) => {
  let stores = [];
  let docs = data.docs;
  docs.map((doc) => {
    const selectedStore = {
      name: doc.data().name,
      address: doc.data().address,
      openingTime: doc.data().openingTime,
      closingTime: doc.data().closingTime,
      phone_number: doc.data().phone_number,
      geometry: doc.data().geometry,
      picture: doc.data().picture,
      city: doc.data().city,
      store_products: doc.data().store_products,
      store_id: doc.data().store_id,
    };
    stores.push(selectedStore);
  });
  return stores;
};

storesRouter.get("/", (req, res) => {
  (async () => {
    try {
      await storesControllers.getAllStores().then((data) => {
        const stores = arrayingStores(data);
        res.status(200).json(stores);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

storesRouter.get("/store_pictures", (req, res) => {
  (async () => {
    try {
      await storesControllers.getAllStores_pics().then((data) => {
        let stores_pics = [];
        let docs = data.docs;
        docs.map((doc) => {
          const selectedStorePic = {
            picture_id: doc.data().picture_id,
            picture: doc.data().picture,
          };
          stores_pics.push(selectedStorePic);
        });
        res.status(200).json(stores_pics);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

storesRouter.get("/:id", validateID, (req, res) => {
  const id = req.params.id;
  (async () => {
    try {
      await storesControllers.getStoreById(id).then((store) => {
        res.status(200).send(store);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

storesRouter.get("/storesbycity/:city", (req, res) => {
  const city = req.params.city;
  (async () => {
    try {
      await storesControllers.getStoresByCity(city).then((data) => {
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

storesRouter.post("/", (req, res) => {
  const store_id = uuidv4();
  const store = {
    name: req.body.name,
    address: req.body.address,
    phone_number: req.body.phone_number,
    geometry: req.body.geometry,
    picture: req.body.picture,
    city: req.body.city,
    store_products: req.body.store_products,
    openingTime: req.body.openingTime,
    closingTime: req.body.closingTime,
    store_id,
  };
  (async () => {
    try {
      await storesControllers.createStore(store).then(() => {
        return res.status(201).send({
          status: "Success",
          msg: "Store saved successfully...",
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

storesRouter.post("/store_picture", (req, res) => {
  const picture_id = uuidv4();
  const store_picture = {
    picture: req.body.picture,
    picture_id,
  };
  (async () => {
    try {
      await storesControllers.createStorePicture(store_picture).then(() => {
        return res.status(201).send({
          status: "Success",
          msg: "Picture created successfully...",
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

storesRouter.put("/:id", validateID, (req, res) => {
  const id = req.params.id;
  const store = {
    name: req.body.name,
    address: req.body.address,
    phone_number: req.body.phone_number,
    geometry: req.body.geometry,
    picture: req.body.picture,
    city: req.body.city,
    store_products: req.body.store_products,
    store_id: req.body.store_id,
    openingTime: req.body.openingTime,
    closingTime: req.body.closingTime,
  };
  // console.log("STORE:", store);
  (async () => {
    try {
      await storesControllers.updateStore(store, id).then(() => {
        return res.status(200).send({
          status: "Success",
          msg: "Store updated successfully...",
        });
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

storesRouter.delete("/:id", validateID, (req, res) => {
  const id = req.params.id;
  // console.log("STORE ID AT END POINT:", id);
  (async () => {
    try {
      await storesControllers.deleteStore(id).then(() => {
        return res.status(200).send({
          status: "Success",
          msg: "Store deleted successfully...",
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

module.exports = storesRouter;
