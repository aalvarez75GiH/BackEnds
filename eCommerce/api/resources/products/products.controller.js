const Product = require('./products.model')

const createProduct = (product, owner) => {
    // return Promise.reject('This is a controlled Error...')
    return new Product({
        ...product,
        owner: owner
    }).save()
}

const getProducts = () => {
    return Product.find({})
}

const getOneProduct = (id) => {
    return Product.findById(id)
}

const deleteProduct = (id) => {
    return Product.findByIdAndRemove(id)
}

const replaceProduct = (id, product, username) => {
    return Product.findOneAndUpdate({_id: id}, {
        ...product,
        owner: username
    },{
        new: true //This option is in order to return the new document modified
    })
}

module.exports = {
    createProduct,
    getProducts,
    getOneProduct,
    deleteProduct,
    replaceProduct
}

