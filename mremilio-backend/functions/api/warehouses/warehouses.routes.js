const express = require("express");
const warehousesController = require("./warehouses.controllers");
const url = require("url");
const { v4: uuidv4 } = require("uuid");
const validate = require("uuid-validate");
const warehousesRouter = express.Router();
const axios = require("axios");
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

// Consolidation warehouses in an array
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
    };
    console.log(selectedWarehouse);
    warehouses.push(selectedWarehouse);
    // console.log("WAREHOUSES AT ARRAYING:", warehouses);
  });
  return warehouses;
};

// Get All warehouses from Firesote
warehousesRouter.get("/", (req, res) => {
  (async () => {
    try {
      await warehousesController.getAllWarehouses().then((data) => {
        const warehouses = arrayingWarehouses(data);
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
          console.log(selectedWarehousePic);
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
      // url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address&types=administrative_area_level_1&key=${process.env.GOOGLE_KEY}`,

      headers: {},
    };

    await axios(config)
      .then((responseFromGoogle) => {
        // console.log("RESULTS:", responseFromGoogle.data);
        // console.log(
        //   "response from Google",
        //   responseFromGoogle.data.results[0].address_components
        // );
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
    // console.log(origin);
    let warehouses = [];
    try {
      await warehousesController.getAllWarehouses().then(async (data) => {
        warehouses = arrayingWarehouses(data);
        // console.log("WAREHOUSES AT DISTANCE MATRIX:", warehouses);
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
        // console.log("Most Closest Warehouse to customer:", closest_warehouse);
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

  console.log("MAX DELIVERY TIME:", maxDeliveryTime);
  console.log("MAX DISTANCE DELIVERY:", maxDistanceDeliveryMeters);
  console.log("MAX DISTANCE PICKUP:", maxDistancePickupMeters);
  const warehouse = {
    name: req.body.name,
    address: req.body.address,
    geometry: req.body.geometry,
    picture: req.body.picture,
    max_limit_ratio_pickup: maxDistancePickupMeters,
    max_limit_ratio_delivery: maxDistanceDeliveryMeters,
    max_delivery_time: maxDeliveryTime,
    warehouse_id,
    products: req.body.products,
    city: req.body.city,
    openingTime: req.body.openingTime,
    closingTime: req.body.closingTime,
    phone_number: req.body.phone_number,
  };
  console.log("WAREHOUSE AT END POINT:", warehouse);
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

  console.log("MAX DELIVERY TIME:", maxDeliveryTime);
  console.log("MAX DISTANCE DELIVERY:", maxDistanceDeliveryMeters);
  console.log("MAX DISTANCE PICKUP:", maxDistancePickupMeters);
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

// {
//   "name": "Main Warehouse",
//   "address": "6650 Cold Stream Dr, Cumming, GA 30040",
//   "work_hour": "9:00 am - 7:00 pm",
//   "geometry": {
//       "location": {
//           "lat": 34.17399635788976,
//           "lng": -84.1764201453649
//       }
//   },
//   "picture": "",
//   "max_limit_ratio_pickup": 32186.9,
//   "max_limit_ratio_delivery": 32186.9
// },
// {
//   "name": "Mr Emilio Store - Winder",
//   "address": "79 E Athens St, Winder, GA 30680",
//   "work_hour": "9:00 am - 10:00 pm",
//   "geometry": {
//       "location": {
//           "lng": -83.71976174174195,
//           "lat": 33.99142934065858
//       }
//   },
//   "picture": "",
//   "max_limit_ratio_pickup": 32186.9,
//   "max_limit_ratio_delivery": 32186.9
// }
