'use strict';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const AWS = require('aws-sdk');
const mkdirp = require('mkdirp');

const s3Dl = Promise.promisify(require('./get-files'));
const zipFile = Promise.promisify(require('./write-zip'));

exports.handler = function(event, context, cb) {

  // Source and Dest on S3
  const bucket = event.bucket;
  const folder = event.folder;
  const region = event.region;

  // Destination on S3
  const outputFile = event.outputFile;

  // Source Files to Download from S3 of the proxies
  const files = event.files;
  const unverifiedFiles = event.unverifiedFiles;

  // const s3 = new AWS.S3();

  try {

    const timestamp = `${new Date().getTime()}`;
    const tmpDir = path.join(__dirname, '/tmp/', timestamp);
    const tmpDirUnverified = path.join(tmpDir, '/unverified');
    const destinationFile = path.join(__dirname, `/tmp/${timestamp}_proxies.zip`);

    // Create a new temp directory to store the files
    mkdirp(tmpDirUnverified, err => {

      if (err) {
        cb(err);
      }

      let downloads = [];

      // Download the unverified proxies to their own sub directory
      unverifiedFiles.map(file => {
        const key = folder + file;
        const outFile = tmpDirUnverified + '/' + file;
        downloads.push(s3Dl(bucket, key, outFile));
      });

      // Download the verified proxies to the root directory
      files.map(file => {
        const key = folder + file;
        const outFile = tmpDir + '/' + file;
        downloads.push(s3Dl(bucket, key, outFile));
      });

      // Download the files
      Promise.all(downloads).then(() => {
        return zipFile(tmpDir, destinationFile);
      }).then(() => {
        console.log('Done zipping');
        cb(null, 'test');
      }).catch(err => {
        console.log(err);
        throw new Error(err);
      });

    });

    // Where to upload file
    // const s3 = new AWS.S3({params: {Bucket: bucket, Key: outputFile}});

  //   // The files to add to zip
  //   const body = s3Zip.archive({ region: region, bucket: bucket}, folder, files);
  //
  //   // Upload the file
  //   s3.upload({Body: body}, (err, res) => {
  //     if (err) {
  //       console.error(err);
  //       return cb(err);
  //     }
  //     console.log('Uploaded successfully', res);
  //     cb(null, res);
  //   });
  //
  } catch (e) {
    console.error(e);
    cb(e);
  }
};
