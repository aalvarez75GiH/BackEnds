const Product = require('./products.model')

const createProduct = (product, owner) => {
    return new Product({
        ...product,
        owner: owner
    }).save()
}

const getProducts = () => {
    return Product.find({})
}

const getProductsById = (id) => {
    return Product.findById(id)
}

module.exports = {
    createProduct,
    getProducts,
    getProductsById
}

