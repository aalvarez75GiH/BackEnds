
const environment = process.env.NODE_ENV || 'development'
const baseConfiguration = {
    jwt:{},
    port:5000,
    environment,
    s3:{
        accessKeyId: 'AKIA6J62GRX5XQYN4FGS',
        secretAccessKey: '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'
    },
    s3BucketName: 'sh3ck-s3-bucket',
    bucketPath: 'images',
    categoryPath: 'category',
    checkersPath: 'checkers',
    usersPath: 'users',
    authCentersPath: 'authCenters',
    paymentsPath: 'payments'

}

let environmentConfiguration = {}

switch (environment){
    case 'development' :
    case 'dev':
    case 'desarrollo':
        environmentConfiguration = require('./dev')
        break
    case 'production':
    case 'prod':
    case 'produccion':
        environmentConfiguration = require('./prod')
        break
    case 'test':
        environmentConfiguration = require('./test')
        break
    default:
        environmentConfiguration = require('./dev')
        break
}

module.exports = {
    ...baseConfiguration,
    ...environmentConfiguration

}