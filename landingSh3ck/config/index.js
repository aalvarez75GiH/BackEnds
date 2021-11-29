const environment = process.env.NODE_ENV || 'development'
const baseConfiguration = {
    jwt:{},
    port:5000
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