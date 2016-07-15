'use strict';

const s3Zip = require('s3-zip');
const AWS = require('aws-sdk');

exports.handler = function(event, context, cb) {

  const bucket = event.bucket;
  const folder = event.folder;
  const region = event.region;

  // Destination
  const outputFile = event.outputFile

  // Source Files
  const files = event.files;

  try {
    // Where to upload file
    const s3 = new AWS.S3({params: {Bucket: bucket, Key: outputFile}});

    // The files to add to zip
    const body = s3Zip.archive({ region: region, bucket: bucket}, folder, files);

    // Upload the file
    s3.upload({Body: body}, (err, res) => {
      if (err) {
        console.error(err);
        return cb(err);
      }
      console.log('Uploaded successfully', res);
      cb(null, res);
    });

  } catch (e) {
    console.error(e);
    cb(e);
  }
}
