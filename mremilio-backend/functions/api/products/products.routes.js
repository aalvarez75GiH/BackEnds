const express = require("express");
const { v4: uuidv4 } = require("uuid");
const validate = require("uuid-validate");
const productController = require("./products.controllers");
const productsRouter = express.Router();
const warehouseController = require("../warehouses/warehouses.controllers");

const validateID = (req, res, next) => {
  let id = req.params.id;
  const validation = validate(id);
  if (!validation) {
    res.status(400).send(`id [${id}] entered is not valid...`);
    return;
  }
  next();
};

productsRouter.get("/", (req, res) => {
  (async () => {
    try {
      await productController.getAllProducts().then((data) => {
        let products = [];
        let docs = data.docs;
        docs.map((doc) => {
          const selectedProduct = {
            name: doc.data().name,
            description: doc.data().description,
            price: doc.data().price,
            stock: doc.data().stock,
            size: doc.data().size,
            quantity: doc.data().quantity,
            picture: doc.data().picture,
            rating: doc.data().rating,
            product_id: doc.data().product_id,
            area_availability: doc.data().area_availability,
          };
          console.log(selectedProduct);
          products.push(selectedProduct);
        });
        // console.log(products);
        res.status(200).json(products);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

productsRouter.get("/product_pictures", (req, res) => {
  (async () => {
    try {
      await productController.getAllProducts_pics().then((data) => {
        let products_pics = [];
        let docs = data.docs;
        docs.map((doc) => {
          const selectedProductPic = {
            picture_id: doc.data().picture_id,
            picture: doc.data().picture,
          };
          console.log(selectedProductPic);
          products_pics.push(selectedProductPic);
        });
        // console.log(products);
        res.status(200).json(products_pics);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

productsRouter.get("/:id", validateID, (req, res) => {
  const id = req.params.id;
  (async () => {
    try {
      await productController.getProductById(id).then((product) => {
        console.log(product);
        res.status(200).send(product);
      });
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

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
      representative: doc.data().representative,
    };
    // console.log(selectedWarehouse);
    warehouses.push(selectedWarehouse);
  });
  return warehouses;
};

productsRouter.post("/", (req, res) => {
  const product_id = uuidv4();
  const product = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    size: req.body.size,
    quantity: req.body.quantity,
    picture: req.body.picture,
    rating: req.body.rating,
    product_id,
    area_availability: req.body.area_availability,
  };
  (async () => {
    try {
      await productController
        .createProduct(product)
        .then(async (new_product) => {
          console.log("NEW PRODUCT:", new_product);
          const data = await warehouseController.getAllWarehouses();
          const warehouses = arrayingWarehouses(data);
          // console.log("WAREHOUSES AT END POINT:", warehouses);
          // ********************************************************
          warehouses.map((warehouse) => {
            const itDoesExists = warehouse.products.includes(new_product);
            console.log("DOES IT EXISTS?:", itDoesExists);
            if (itDoesExists) {
              console.log("Does exists...");
              return;
            }
            if (!itDoesExists) {
              console.log("Does not exists...");
              warehouse.products.push(new_product);
              warehouseController.updateWarehouseNewProduct(warehouse);
            }

            // warehouse.products.map((product) => {
            //   if (product.product_id === new_product.product_id) {
            //     console.log("PRODUCT EXISTS");
            //   } else {
            //     console.log("PRODUCT DOES NOT EXISTS");
            //     warehouse.products.push(new_product);
            //     warehouseController.updateWarehouseNewProduct(warehouse);
            //   }
            // });
            // console.log("PRODUCTS OF THIS WAREHOUSE:", warehouse.products);

            // docs.map((doc) => {
            //   const selectedWarehousePic = {
            //     picture_id: doc.data().picture_id,
            //     picture: doc.data().picture,
            //   };
            //   console.log(selectedWarehousePic);
            //   warehouses_pics.push(selectedWarehousePic);
            // });
          });
          // ********************************************************
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

productsRouter.post("/product_picture", (req, res) => {
  const picture_id = uuidv4();
  const product_picture = {
    picture: req.body.picture,
    picture_id,
  };
  (async () => {
    try {
      await productController.createProductPicture(product_picture).then(() => {
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

productsRouter.put("/:id", validateID, (req, res) => {
  const id = req.params.id;
  const product = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    size: req.body.size,
    quantity: req.body.quantity,
    picture: req.body.picture,
    rating: req.body.rating,
    area_availability: req.body.area_availability,
  };
  (async () => {
    try {
      await productController.updateProduct(product, id).then(() => {
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

productsRouter.delete("/:id", validateID, (req, res) => {
  const id = req.params.id;
  (async () => {
    try {
      await productController.deleteProduct(id).then(() => {
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

module.exports = productsRouter;
