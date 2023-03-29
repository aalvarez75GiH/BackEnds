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
      active: doc.data().active,
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
          const data = await warehouseController.getAllWarehouses();
          const warehouses = arrayingWarehouses(data);
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
              warehouseController.updateWarehouse(
                warehouse,
                warehouse.warehouse_id
              );
            }
          });

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
    product_id: req.body.product_id,
  };
  (async () => {
    try {
      await productController
        .updateProduct(product, id)
        .then(async (product_to_update) => {
          let cont = 0;
          console.log("PRODUCT TO UPDATE:", product_to_update);
          const data = await warehouseController.getAllWarehouses();
          const warehouses = arrayingWarehouses(data);

          warehouses.map(async (warehouse) => {
            const indexOfProductToUpdate = warehouse.products.findIndex(
              (index) => index.product_id === product_to_update.product_id
            );
            console.log("INDEX:", indexOfProductToUpdate);

            if (indexOfProductToUpdate !== -1) {
              warehouse.products[indexOfProductToUpdate] = {
                name: product_to_update.name,
                description: product_to_update.description,
                price: product_to_update.price,
                stock: warehouse.products[indexOfProductToUpdate].stock,
                size: product_to_update.size,
                quantity: product_to_update.quantity,
                picture: product_to_update.picture,
                rating: product_to_update.rating,
                area_availability:
                  warehouse.products[indexOfProductToUpdate].area_availability,
                product_id: product_to_update.product_id,
              };

              console.log("WAREHOUSE TO UPDATE:", warehouse);
              await warehouseController.updateWarehouse(
                warehouse,
                warehouse.warehouse_id
              );
            }

            if (indexOfProductToUpdate === -1) {
              return res.status(404).send({
                status: "Failed",
                msg: "Product Not found",
              });
            }
          });

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
// Crema acaramelada en base a leche perfecta para galletas, obleas y mucha más
productsRouter.delete("/:id", validateID, (req, res) => {
  const id = req.params.id;
  (async () => {
    try {
      await productController.getProductById(id).then(async (product) => {
        await productController
          .deleteProduct(product, product.product_id)
          .then(async (product_to_delete) => {
            const data = await warehouseController.getAllWarehouses();
            const warehouses = arrayingWarehouses(data);
            warehouses.map((warehouse) => {
              const indexOfProductToDelete = warehouse.products.findIndex(
                (index) => index.product_id === product_to_delete.product_id
              );
              console.log("INDEX:", indexOfProductToDelete);

              if (indexOfProductToDelete === -1) {
                return res.status(404).send({
                  status: "Failed",
                  msg: "Product Not found",
                });
              }
              if (indexOfProductToDelete !== -1) {
                warehouse.products.splice(indexOfProductToDelete, 1);
                warehouseController.updateWarehouse(
                  warehouse,
                  warehouse.warehouse_id
                );
                return;
              }
            });

            return res.status(200).send({
              status: "Success",
              msg: "Data deleted successfully...",
            });
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
