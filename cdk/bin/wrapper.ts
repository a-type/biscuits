// this is kinda dumb but IDK a better way to do it.
// I mean, I could use AWS provisioning directly, but CDK has
// some advantages. I just can't figure out how to reactively
// provision in other services from within CDK.

// so this script is a wrapper around the CDK CLI that will
// monitor the output for certain things and then provision
// the other services as needed.

import { spawn } from 'child_process';
import * as fs from 'fs/promises';

import { createDnsRecord } from '../lib/porkbun.js';
import { addRepositoryVariable } from '../lib/github.js';

const appId = process.argv[3];

const cdk = spawn(
  'pnpm',
  ['cdk-raw', 'deploy', appId, '--require-approval=never'],
  {
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);

function constify(str: string) {
  return str.toUpperCase().replace(/[^A-Z0-9]/g, '_');
}

let allOutput = '';

cdk.stdout.on('data', (data) => {
  process.stdout.write(data);
  allOutput += data;

  // detect Certificates and provision the required CNAME
  // in porkbun
  // Looks like: Content of DNS Record is: {Name: BLAH.biscuits.club.,Type: CNAME,Value: BLAH}
  const match = data
    .toString()
    .match(
      /Content of DNS Record is: {Name: ([^.]+)\.biscuits\.club.,Type: CNAME,Value: ([^.]+)}/,
    );
  if (match) {
    const [, name, value] = match;
    createDnsRecord('biscuits.club', {
      type: 'CNAME',
      name,
      content: value,
    });
  }

  // detect S3 bucket name and add it to the GitHub repository
  // Looks like: app-id.BucketName = BLAH.biscuits.club
  const s3Match = data.toString().match(/BucketName = (.+)/);
  if (s3Match) {
    const bucketName = s3Match[1];
    addRepositoryVariable('S3_BUCKET_' + constify(appId), bucketName);
  }

  // detect Cloudfront distribution ID and add it to the
  // GitHub repository
  // Looks like: app-id.DistributionId = BLAH
  const cfMatch = data.toString().match(/DistributionId = (.+)/);
  if (cfMatch) {
    const cfId = cfMatch[1];
    addRepositoryVariable('CLOUDFRONT_ID_' + constify(appId), cfId);
  }

  // detect Cloudfront domain and add a CNAME record to porkbun
  // Looks like: app-id.DistributionDomainName = BLAH
  const cfDomainMatch = data.toString().match(/DistributionDomainName = (.+)/);
  if (cfDomainMatch) {
    const domain = cfDomainMatch[1];
    createDnsRecord('biscuits.club', {
      type: 'CNAME',
      name: appId,
      content: domain,
    });
  }
});

cdk.stderr.on('data', (data) => {
  process.stderr.write(data);
  allOutput += data;
});

cdk.on('close', async (code) => {
  await fs.writeFile('cdk-output.txt', allOutput);
  if (code === 0) {
    console.log('CDK exited cleanly');
  } else {
    console.error('CDK exited with code', code);
    console.error(allOutput);
  }
});
