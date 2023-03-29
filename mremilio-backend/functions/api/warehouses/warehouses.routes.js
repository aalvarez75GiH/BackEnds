const express = require("express");
const warehousesController = require("./warehouses.controllers");
const url = require("url");
const { v4: uuidv4 } = require("uuid");
const validate = require("uuid-validate");
const warehousesRouter = express.Router();
const axios = require("axios");
const warehousesHandlers = require("./warehouses.handlers");

require("dotenv").config();

const validateID = (req, res, next) => {
  let id = req.params.id;
  const validation = validate(id);
  if (!validation) {
    res.status(400).send(`id [${id}] entered is not valid...`);
    return;
  }
  next();
};

// Get All warehouses from Firesote
warehousesRouter.get("/", (req, res) => {
  (async () => {
    try {
      await warehousesController.getAllWarehouses().then((data) => {
        // const warehouses = arrayingWarehouses(data);
        const warehouses = warehousesHandlers.arrayingWarehouses(data);
        res.status(200).json(warehouses);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

warehousesRouter.get("/wh_for_admin", (req, res) => {
  (async () => {
    try {
      await warehousesController.getAllWarehouses().then((data) => {
        // const warehouses = arrayingWarehousesForAdmin(data);
        const warehouses = warehousesHandlers.arrayingWarehousesForAdmin(data);
        // console.log("RESPONSE AT GET END POINT:", warehouses);
        res.status(200).json(warehouses);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

warehousesRouter.get("/warehouse_pictures", (req, res) => {
  (async () => {
    try {
      await warehousesController.getAllWarehouses_pics().then((data) => {
        let warehouses_pics = [];
        let docs = data.docs;
        docs.map((doc) => {
          const selectedWarehousePic = {
            picture_id: doc.data().picture_id,
            picture: doc.data().picture,
          };
          // console.log(selectedWarehousePic);
          warehouses_pics.push(selectedWarehousePic);
        });
        // console.log(products);
        res.status(200).json(warehouses_pics);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

warehousesRouter.get("/geocoding", (req, res) => {
  (async () => {
    const { lat, lng } = url.parse(req.url, true).query;
    console.log("Lat:", lat, "Lng:", lng);

    var config = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address&key=${process.env.GOOGLE_KEY}`,
      headers: {},
    };

    await axios(config)
      .then((responseFromGoogle) => {
        res.json(responseFromGoogle.data.results[0]);
      })
      .catch((error) => {
        console.log("ERROR:", error);
      });
  })();
});

// Determine nearest warehose from device location
warehousesRouter.get("/distanceMatrix", (req, res) => {
  // console.log("PASA AL MENOS X AQUI");
  (async () => {
    const { lat, lng } = url.parse(req.url, true).query;
    const origin = {
      lat: lat,
      lng: lng,
    };
    let warehouses = [];
    try {
      await warehousesController.getAllWarehouses().then(async (data) => {
        // warehouses = arrayingWarehouses(data);
        warehouses = warehousesHandlers.arrayingWarehouses(data);
        console.log("ACTIVE WAREHOUSES:", warehouses);
        let available_warehouses = [];
        let most_optimum_warehouse_forCustomer = [];
        const warehouses_with_distance_from_google = await Promise.all(
          warehouses.map(async (warehouse, index) => {
            const { geometry } = warehouse;
            const { location } = geometry;
            const { lat: wLat, lng: wLng } = location;
            console.log(wLat, wLng);

            let customerDistanceToWarehouse;
            let customerDistanceToWarehouse_in_miles;
            let customer_distance_time;

            const dest = {
              lat: wLat,
              lng: wLng,
            };

            var config = {
              method: "get",
              url: `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.lat}%2C${origin.lng}&destinations=${dest.lat}%2C${dest.lng}%7C${dest.lat}%2C${dest.lng}%7C${dest.lat}%2C${dest.lng}%7C${dest.lat}%2C${dest.lng}&key=${process.env.GOOGLE_KEY}`,
              headers: {},
            };

            await axios(config).then((responseFromGoogle) => {
              // console.log(responseFromGoogle);
              const distance_in_miles =
                responseFromGoogle.data.rows[0].elements[0].distance.text;
              customerDistanceToWarehouse_in_miles = distance_in_miles;
              console.log(
                "DISTANCE IN MILES:",
                customerDistanceToWarehouse_in_miles
              );
              const distance_in_meters =
                responseFromGoogle.data.rows[0].elements[0].distance.value;
              customerDistanceToWarehouse = distance_in_meters;
              console.log("DISTANCE IN METERS:", customerDistanceToWarehouse);
              const distance_in_time =
                responseFromGoogle.data.rows[0].elements[0].duration.text;
              customer_distance_time = distance_in_time;
              console.log("DISTANCE IN Time:", customer_distance_time);
            });
            warehouse["customer_distance_to_warehouse"] =
              customerDistanceToWarehouse;
            warehouse["distance_in_miles"] =
              customerDistanceToWarehouse_in_miles;
            warehouse["distance_time"] = customer_distance_time;
            available_warehouses.push(warehouse);
            // console.log("AVAILABLE WAREHOUSES:", available_warehouses);
            return warehouse;
          })
        );
        const closest_warehouse = warehouses_with_distance_from_google.reduce(
          (previous, current) => {
            return previous.customer_distance_to_warehouse <
              current.customer_distance_to_warehouse
              ? previous
              : current;
          }
        );
        console.log("Most Closest Warehouse to customer:", closest_warehouse);
        most_optimum_warehouse_forCustomer.push(closest_warehouse);
        res.status(200).send(most_optimum_warehouse_forCustomer);
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

// Get a warehouse by Id from Firesote
warehousesRouter.get("/:id", validateID, (req, res) => {
  const id = req.params.id;
  (async () => {
    try {
      await warehousesController.getWarehouseById(id).then((warehouse) => {
        console.log(warehouse);
        res.status(200).send(warehouse);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

// Create warehouse at Firestore
warehousesRouter.post("/", (req, res) => {
  const warehouse_id = uuidv4();

  const maxDistanceDeliveryMeters =
    parseInt(req.body.max_limit_ratio_delivery) * 1609.34;
  const maxDistancePickupMeters =
    parseInt(req.body.max_limit_ratio_pickup) * 1609.34;

  const maxDeliveryTime = parseInt(req.body.max_delivery_time);

  const warehouse = {
    name: req.body.name,
    address: req.body.address,
    geometry: req.body.geometry,
    picture: req.body.picture,
    max_limit_ratio_pickup: maxDistancePickupMeters,
    max_limit_ratio_delivery: maxDistanceDeliveryMeters,
    max_delivery_time: maxDeliveryTime,
    products: req.body.products,
    city: req.body.city,
    openingTime: req.body.openingTime,
    closingTime: req.body.closingTime,
    phone_number: req.body.phone_number,
    representative: req.body.representative,
    active: true,
    warehouse_id,
  };

  (async () => {
    try {
      await warehousesController.createWarehouse(warehouse).then(() => {
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

warehousesRouter.post("/warehouse_picture", (req, res) => {
  const picture_id = uuidv4();
  const warehouse_picture = {
    picture: req.body.picture,
    picture_id,
  };
  (async () => {
    try {
      await warehousesController
        .createWarehousePicture(warehouse_picture)
        .then(() => {
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

// Update a warehouse by Id at Firestore
warehousesRouter.put("/:id", validateID, (req, res) => {
  const id = req.params.id;

  const maxDistanceDeliveryMeters =
    parseInt(req.body.max_limit_ratio_delivery) * 1609.34;
  const maxDistancePickupMeters =
    parseInt(req.body.max_limit_ratio_pickup) * 1609.34;

  const maxDeliveryTime = parseInt(req.body.max_delivery_time);

  const warehouse = {
    name: req.body.name,
    geometry: req.body.geometry,
    work_hour: req.body.work_hour,
    address: req.body.address,
    max_limit_ratio_pickup: maxDistancePickupMeters,
    max_limit_ratio_delivery: maxDistanceDeliveryMeters,
    max_delivery_time: maxDeliveryTime,
    picture: req.body.picture,
    products: req.body.products,
    phone_number: req.body.phone_number,
    openingTime: req.body.openingTime,
    closingTime: req.body.closingTime,
    city: req.body.city,
    representative: req.body.representative,
    active: req.body.active,
  };
  (async () => {
    try {
      await warehousesController.updateWarehouse(warehouse, id).then(() => {
        return res.status(201).send({
          status: "Success",
          msg: "Data updated successfully...",
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

warehousesRouter.put("/status/:id", validateID, (req, res) => {
  const id = req.params.id;

  (async () => {
    try {
      const warehouse = await warehousesController.getWarehouseById(id);
      console.log("WAREHOUSE TO UPDATE STATUS:", warehouse);
      warehouse.active = !warehouse.active;
      console.log("STATUS:", warehouse.active);
      console.log("WAREHOUSE TO UPDATE STATUS BEFORE UPDATE:", warehouse);

      await warehousesController.updateWarehouse(warehouse, id).then(() => {
        return res.status(201).send({
          status: "Success",
          msg: "Data updated successfully...",
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

warehousesRouter.delete("/:id", validateID, (req, res) => {
  const id = req.params.id;
  (async () => {
    try {
      await warehousesController.deleteWarehouse(id).then(() => {
        return res.status(200).send({
          status: "Success",
          msg: "Warehouse deleted successfully...",
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

module.exports = warehousesRouter;
