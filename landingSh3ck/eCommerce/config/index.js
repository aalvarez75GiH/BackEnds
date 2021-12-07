const environment = process.env.NODE_ENV || 'development'
const baseConfiguration = {
    jwt:{},
    environment,
    port:3000,
    deleteLogs:false,
    s3:{
        accessKeyId: 'AKIA6J62GRX5YSAIBEUF',
        secretAccessKey: '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'
    },
    s3BucketName: 'p3rolix-s3-latiendita',
    bucketPath: 'images'

}
// S3_ACCESS_KEY_ID=AKIA6J62GRX5YSAIBEUF
// S3_SECRET_KEY=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
let environmentConfiguration = {}

switch (environment){
    case 'development':
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
}

module.exports = {
    ...baseConfiguration,
    ...environmentConfiguration

}