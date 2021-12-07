class UserDataAlreadyInUse extends Error {
    constructor(message){
        super(message)
        this.message = message || 'Email or username already associated to an account'
        this.status = 409
        this.name = 'UserDataAlreadyInUse'
    }
}

class IncorrectCredentials extends Error {
    constructor(message){
        super(message)
        this.message = message || 'Invalid credentials, user failed authentication...'
        this.status = 400
        this.name = 'IncorrectCredentials'
    }
}

module.exports = {
    UserDataAlreadyInUse,
    IncorrectCredentials
}