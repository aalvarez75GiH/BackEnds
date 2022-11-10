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
      work_hour: doc.data().work_hour,
      phone_number: doc.data().phone_number,
      geometry: doc.data().geometry,
      picture: doc.data().picture,
      city: doc.data().city,
      store_products: doc.data().store_products,
      store_id: doc.data().store_id,
    };
    console.log(selectedStore);
    stores.push(selectedStore);
    console.log("STORES AT ARRAYING:", stores);
  });
  return stores;
};

storesRouter.get("/", (req, res) => {
  (async () => {
    try {
      await storesControllers.getAllStores().then((data) => {
        const stores = arrayingStores(data);
        console.log("RESPONSE AT GET END POINT:", stores);
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
            url: doc.data().url,
          };
          console.log(selectedStorePic);
          stores_pics.push(selectedStorePic);
        });
        // console.log(products);
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
        console.log(store);
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
        console.log("DATA:", data);
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
    work_hour: req.body.work_hour,
    phone_number: req.body.phone_number,
    geometry: req.body.geometry,
    picture: req.body.picture,
    city: req.body.city,
    store_products: req.body.store_products,
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
    url: req.body.url,
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
    work_hour: req.body.work_hour,
    phone_number: req.body.phone_number,
    geometry: req.body.geometry,
    picture: req.body.picture,
    city: req.body.city,
    store_products: req.body.store_products,
    store_id: req.body.store_id,
  };
  console.log("STORE:", store);
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
