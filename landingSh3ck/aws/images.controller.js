const AWS = require('aws-sdk')
const config =require('../config')

console.log(config.s3)
const awsCredentials = config.s3
const categoryPath = config.categoryPath
const bucketName = config.s3BucketName
const bucketPath = config.bucketPath
const s3Client = new AWS.S3(awsCredentials)

const saveCategoryImage = (imageData, fileName) => {
    s3Client.putObject({
        Body: imageData,
        Bucket: bucketName,
        Key: `${bucketPath}/${categoryPath}/${fileName}`

    }).promise()
    
    return `https://s3.amazonaws.com/${bucketName}/${bucketPath}/${categoryPath}/${fileName}`
}

module.exports = {
    saveCategoryImage
}