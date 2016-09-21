'use strict';

const s3DlZip = require('./index');
const moment = require('moment');

const verifiedProxies = [
  'test_proxy.pdf',
  'test_proxy_1.pdf',
  'test_proxy_2.pdf',
  'test_proxy_3.pdf'
];

const unverifiedProxies = [
  'unverified_test_proxy.pdf',
  'unverified_test_proxy_1.pdf'
];

const payload = {
  bucket: 'test-nodestream',
  folder: 'test/',
  region: 'us-east-1',
  files: verifiedProxies,
  unverifiedFiles: unverifiedProxies,
  outputFile: 'test/processed/output' + moment().unix() + '.zip'
};

s3DlZip.handler(payload, null, function(err, res) {
  console.log(err, res);
});
