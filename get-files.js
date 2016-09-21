'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');

function getFileFromS3(bucket, key, dest, cb) {

  try {

    const outFile = fs.createWriteStream(dest);

    s3.getObject({Bucket: bucket, Key: key})
      .on('httpData', chunk => outFile.write(chunk))
      .on('httpDone', () => {
        console.log('done ' + key);
        outFile.end();
        cb(dest);
      })
      .send();
  } catch (err) {
    cb(err);
  }

}

module.exports = getFileFromS3;
