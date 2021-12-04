const AWS = require('aws-sdk')
const config =require('../../config')

console.log(config.s3)
const awsCredentials = config.s3
const bucketName = config.s3BucketName
const bucketPath = config.bucketPath
const s3Client = new AWS.S3(awsCredentials)

const saveImage = (imageData, fileName) => {
    return s3Client.putObject({
        Body: imageData,
        Bucket: bucketName,
        Key: `${bucketPath}/${fileName}`

    }).promise()
    
    return `https://s3.amazonaws.com/${bucketName}/${bucketPath}/${fileName}`
}

module.exports ={
    saveImage
}