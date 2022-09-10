const express = require("express");
const passport = require("passport");
const { v4: uuidv4 } = require("uuid");

const validatingProductImage =
  require("./products.validate").validatingProductImage;
const validatingProductData =
  require("./products.validate").validatingProductData;
const logger = require("../../../utils/logger");
const productController = require("./products.controller");
const jwtAuthorization = passport.authenticate("jwt", { session: false });
const processingErrors = require("../../libs/errorHandler").processingErrors;
const {
  ProductDoesNotExists,
  NotOwnerToProceed,
} = require("./products.errors");
const saveImage = require("../../data/images.controller").saveImage;
const productsRouter = express.Router();

const validarID = (req, res, next) => {
  let id = req.params.id;
  if (id.match(/^[a-fA-F0-9]{24}$/) === null) {
    res.status(400).send(`id [${id}] entered is not valid...`);
    return;
  }
  next();
};

productsRouter.get(
  "/",
  processingErrors((req, res) => {
    return productController.getProducts().then((products) => {
      res.status(201).json(products);
    });
  })
);

productsRouter.get(
  "/:id",
  validarID,
  processingErrors((req, res) => {
    let id = req.params.id;
    return productController.getOneProduct(id).then((product) => {
      if (!product) {
        throw new ProductDoesNotExists(
          `Product with id [${id}] do not exists at DB...`
        );
      }
      logger.info(`Product with id [${id}] was found at DB successfully...`);
      res.status(200).json(product);
    });
  })
);

productsRouter.post(
  "/",
  [jwtAuthorization, validatingProductData],
  processingErrors((req, res) => {
    return productController
      .createProduct(req.body, req.user.username)
      .then((product) => {
        logger.info(
          "Product added to the Products collection",
          product.toObject()
        );
        res.status(201).json(product);
      });
  })
);

productsRouter.put(
  "/:id",
  [jwtAuthorization, validarID, validatingProductData],
  processingErrors(async (req, res) => {
    let id = req.params.id;
    let userWantToPut = req.user.username;
    let productToReplace;

    productToReplace = await productController.getOneProduct(id);

    if (!productToReplace) {
      logger.info(`Product with id [${id}] do not exists at DB...`);
      throw new ProductDoesNotExists(
        `Product with id [${id}] do not exists at DB...`
      );
    }

    if (productToReplace.owner !== userWantToPut) {
      logger.warn(
        `User ${userWantToPut} do not own Product with id ${id}. it can not be Replaced`
      );
      throw new NotOwnerToProceed(`Sorry, you are not the owner of Product ID ${id} 
        you can not replace it if you are not the owner`);
    }

    productController
      .replaceProduct(id, req.body, userWantToPut)
      .then((productReplaced) => {
        logger.info(
          `Product with id [${id}] has been replaced successfully... `,
          productReplaced.toObject()
        );
        res.json(productReplaced.toObject());
      });
  })
);

productsRouter.delete(
  "/:id",
  [jwtAuthorization, validarID],
  processingErrors(async (req, res) => {
    let id = req.params.id;
    let userWantDelete = req.user.username;
    let productToDelete;

    productToDelete = await productController.getOneProduct(id);

    if (!productToDelete) {
      logger.info(`Product with id [${id}] do not exists at DB...`);
      throw new ProductDoesNotExists(
        `Product with id [${id}] do not exists at DB...`
      );
    }

    if (productToDelete.owner !== userWantDelete) {
      logger.info(
        `User ${userWantDelete} do not own Product with id ${id}. it can not be deleted`
      );
      throw new NotOwnerToProceed(
        `Sorry, you are not the owner of Product ID ${id}. You can not delete it if you are not the owner`
      );
    }

    const productDeleted = await productController.deleteProduct(id);
    logger.info(`Product with id [${id}] was deleted successfully...`);
    res.json(productDeleted);
  })
);

productsRouter.put(
  "/:id/image",
  [jwtAuthorization, validatingProductImage],
  processingErrors(async (req, res) => {
    const id = req.params.id;
    const user = req.user.username;
    logger.info(
      `Request from User [${user}] was received. We are processing image with product ID [${id}] `
    );

    const randomizedName = `${uuidv4()}.${req.fileExtension}`;
    const imageURL = await saveImage(req.body, randomizedName);
    const productModified = await productController.saveImageUrl(id, imageURL);
    logger.info(`Product with ID [${id}] was modified. New image link [${imageURL}]
    changed by user [${user}]`);
    res.json(productModified);
  })
);

module.exports = productsRouter;
