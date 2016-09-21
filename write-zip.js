'use strict';

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function zipDirAndWrite(srcDir, cb) {

  const output = fs.createWriteStream(path.resolve(srcDir + '/zipped_proxies.zip'));
  const zip = archiver('zip');

  // Finializing file write and callback on success
  output.on('close', () => {
    console.log('archiver as finished outputting file');
    cb();
  });

  // If the zipper throws an error
  zip.on('error', err => {
    throw new Error(err);
  });

  // Set output
  zip.pipe(output);

  // Do the zipping
  zip.bulk([{
    expand: true,
    cwd: path.resolve(srcDir),
    src: ['**']
  }]).finalize();

}

module.exports = zipDirAndWrite;
