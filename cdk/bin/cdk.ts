#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppStack } from '../lib/AppStack.js';
import { apps } from '@biscuits/apps';
import { SSGStack } from '../lib/SSGStack.js';

const app = new cdk.App();

const common = {
  env: { account: '262002082180', region: 'us-east-1' },
};

const allApps = [
  ...apps,
  {
    id: 'www',
    url: 'https://www.biscuits.club',
    name: 'Biscuits Home',
    description: 'The home page for Biscuits Club.',
    iconPath: 'icon.png',
    devOriginOverride: 'http://localhost:6123',
    demoVideoSrc: '',
    paidDescription: '',
    paidFeatures: [],
  },
  {
    id: 'blog',
    url: 'https://blog.biscuits.club',
    name: 'Biscuits Blog',
    description: 'The blog for Biscuits Club.',
    iconPath: 'icon.png',
    devOriginOverride: 'http://localhost:3000',
    demoVideoSrc: '',
    paidDescription: '',
    paidFeatures: [],
  },
];

for (const appManifest of allApps) {
  new AppStack(app, appManifest.id, {
    ...common,
    appId: appManifest.id,
    tags: {
      appId: appManifest.id,
    },
  });
}

const ssg = [
  {
    id: 'gnocchi-hub',
    subdomain: 'recipes.gnocchi',
    renderPath: '/gnocchi/hubRecipe',
  },
];

for (const ssgManifest of ssg) {
  new SSGStack(app, ssgManifest.id, {
    ...common,
    subdomain: ssgManifest.subdomain,
    renderPath: ssgManifest.renderPath,
    tags: {
      subdomain: ssgManifest.subdomain,
    },
  });
}
