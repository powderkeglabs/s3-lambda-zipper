'use strict';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const AWS = require('aws-sdk');
const mkdirp = require('mkdirp');

const s3Dl = Promise.promisify(require('./get-files'));
const zipFile = Promise.promisify(require('./write-zip'));

exports.handler = async function(event, context, cb) {

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

    const tmpDir = path.join(__dirname, '/tmp/' + new Date().getTime());
    const tmpDirUnverified = path.join(tmpDir, '/unverified');

    // Create a new temp directory to store the files
    mkdirp(tmpDirUnverified, async err => {

      if (err) {
        cb(err);
      }

      // Download the unverified proxies to their own sub directory
      const uvDownloaded = await unverifiedFiles.map(async file => {
        const key = folder + file;
        const outFile = tmpDirUnverified + '/' + file;
        return await s3Dl(bucket, key, outFile);
      });

      // Download the verified proxies to the root directory
      const vDownloaded = await files.map(async file => {
        const key = folder + file;
        const outFile = tmpDir + '/' + file;
        return await s3Dl(bucket, key, outFile);
      });

      await zipFile(tmpDir);

      cb(null, 'test');

    });

    // if (!fs.statSync)
    //
    //
    // // Download first set of files
    // const s3 = new AWS.S3();
    //
    // unverifiedFiles.map(file => {
    //   const key =  folder + file;
    //   console.log(key);
    //   const outFile = fs.createWriteStream(path.resolve(__dirname + '/.tmp/' + file));
    //   s3.getObject({Bucket: bucket, Key: key}).createReadStream().pipe(outFile);
    // });

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
