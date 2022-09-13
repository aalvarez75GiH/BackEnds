const express = require("express");
const { v4: uuidv4 } = require("uuid");
const validate = require("uuid-validate");
const productController = require("./products.controllers");
const productsRouter = express.Router();

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
  };
  (async () => {
    try {
      await productController.createProduct(product).then(() => {
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
// 7e5f4d0e-a024-4bf5-8651-d75d0e7e6a56
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
