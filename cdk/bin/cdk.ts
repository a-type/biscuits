#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();

const common = {
  env: { account: '262002082180', region: 'us-east-1' },
};

for (const appId of ['www', 'blog', 'gnocchi', 'trip-tick']) {
  new CdkStack(app, appId, {
    ...common,
    appId,
  });
}
