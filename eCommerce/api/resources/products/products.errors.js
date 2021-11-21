class ProductDoesNotExists extends Error {
    constructor(message){
        super(message)
        this.message = message || 'Product does not exists at DB'
        this.status = 404
        this.name = 'IncorrectCredentials'
    }
}

class NotOwnerToProceed extends Error {
    constructor(message){
        super(message)
        this.message = message || 'You are not the owner of this asset. Not proceeding with this operation'
        this.status = 401
        this.name = 'NotOwnerToProceed'
    }
}

module.exports = {
    ProductDoesNotExists,
    NotOwnerToProceed
}