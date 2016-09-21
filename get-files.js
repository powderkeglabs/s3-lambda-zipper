'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');

function getFileFromS3(bucket, key, dest, cb) {

  const req = s3.getObject({Bucket: bucket, Key: key});
  const writeStream = fs.createWriteStream(dest);
  req.createReadStream().pipe(writeStream);

  writeStream.on('close', () => {
    console.log('done ' + key);
    cb();
  });

  req.on('error', err => {
    cb(err);
    console.log('Error downloading from S3', err);
  });

  writeStream.on('error', err => {
    cb(err);
    console.log('Error writing file', err);
  });

}

module.exports = getFileFromS3;
