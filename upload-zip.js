'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

function uploadZipToS3(bucket, key, src, cb) {

  const body = fs.createReadStream(path.resolve(src));
  const s3 = new AWS.S3({params: {Bucket: bucket, Key: key}});

  const req = s3.upload({Body: body});

  req.send((err, data) => {
    if (err) {
      console.log('Error uploading to S3', err);
      return cb(err);
    }
    console.log('Done uploading', data);
    cb(null, data);
  });

}

module.exports = uploadZipToS3;
