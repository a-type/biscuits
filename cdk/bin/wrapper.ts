// this is kinda dumb but IDK a better way to do it.
// I mean, I could use AWS provisioning directly, but CDK has
// some advantages. I just can't figure out how to reactively
// provision in other services from within CDK.

// so this script is a wrapper around the CDK CLI that will
// monitor the output for certain things and then provision
// the other services as needed.

import { spawn } from 'child_process';

import { createDnsRecord } from '../lib/porkbun.js';
import { addRepositoryVariable } from '../lib/github.js';

const appId = process.argv[2];

const cdk = spawn('pnpm', ['cdk', 'deploy', appId], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

function constify(str: string) {
  return str.toUpperCase().replace(/[^A-Z0-9]/g, '_');
}

cdk.stdout.on('data', (data) => {
  process.stdout.write(data);

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
});

cdk.stderr.on('data', (data) => {
  process.stderr.write(data);
});
