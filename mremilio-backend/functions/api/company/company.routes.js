const express = require("express");
const { v4: uuidv4 } = require("uuid");
const validate = require("uuid-validate");
const companyController = require("./company.controllers");
const companyRouter = express.Router();

const validateID = (req, res, next) => {
  let id = req.params.id;
  const validation = validate(id);
  if (!validation) {
    res.status(400).send(`id [${id}] entered is not valid...`);
    return;
  }
  next();
};

companyRouter.get("/:id", validateID, (req, res) => {
  const id = req.params.id;
  (async () => {
    await companyController.getCompanyDataById(id).then((response) => {
      console.log("COMPANY DATA AT END POINT:", response);
      res.status(200).json(response);
    });
  })();
});

companyRouter.post("/", (req, res) => {
  const company_id = uuidv4();
  const company = {
    company_name: req.body.company_name,
    address: req.body.address,
    owner: req.body.owner,
    shippingAndHandling_fee: req.body.shippingAndHandling_fee,
    pickup_fee: req.body.pickup_fee,
    discount: req.body.discount,
    tax_fee: req.body.tax_fee,
    company_id,
  };
  (async () => {
    try {
      await companyController.createCompany(company).then(() => {
        return res.status(201).send({
          status: "Success",
          msg: "Company data saved successfully...",
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

module.exports = companyRouter;
