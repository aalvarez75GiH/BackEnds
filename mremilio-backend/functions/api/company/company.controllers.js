const firebase_controller = require("../../fb");

const getCompanyDataById = async (id) => {
  return await firebase_controller.db
    .collection("company")
    .doc(id)
    .get()
    .then((company) => company.data());
};

const createCompany = async (company) => {
  const {
    company_name,
    address,
    owner,
    shippingAndHandling_fee,
    pickup_fee,
    discount,
    tax_fee,
    company_id,
  } = company;
  console.log(company);
  return await firebase_controller.db
    .collection("company")
    .doc(`/${company_id}/`)
    .create({
      company_id,
      companyOfficialInfo: {
        company_name,
        address,
        owner,
      },
      companyFeesAndTaxes: {
        shippingAndHandling_fee,
        pickup_fee,
        discount,
        tax_fee,
      },
    });
};

module.exports = {
  getCompanyDataById,
  createCompany,
};
