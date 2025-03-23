#!/usr/bin/env node

import { confirm, intro, outro, spinner, text } from '@clack/prompts';
import * as fs from 'fs/promises';

intro('create biscuits app');

const name = await text({
	message: 'What is the app ID?',
	placeholder: 'new-app',
	initialValue: '',
	validate: (value) => {
		if (value === '') {
			return 'Please enter an ID';
		}
	},
});

const appId = name.toLowerCase().replace(/\s/g, '-');

// should already exist
const destinationDir = `apps/${appId}`;
const exists = await fs
	.access(destinationDir)
	.then(() => true)
	.catch(() => false);
if (!exists) {
	outro('App not found');
	process.exit(1);
}

// provision Cloudflare Pages project
const provisionSpinner = spinner();
provisionSpinner.start('Provisioning Cloudflare Pages project...');
const response = await fetch(
	`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/pages/projects`,
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
		},
		body: JSON.stringify({
			name: `prod-biscuits-${appId}-app`,
			production_branch: 'main',
		}),
	},
);
const data = await response.json();
if (!response.ok) {
	provisionSpinner.stop('Failed to provision Cloudflare Pages project');
	outro(data.errors.map((error) => error.message).join(', '));
	process.exit(1);
}
provisionSpinner.stop('Cloudflare Pages project provisioned');

const setupDns = await confirm({
	message: `Set up ${appId}.biscuits.club as a custom domain for the Cloudflare Pages project?`,
	default: true,
});

if (setupDns) {
	const dnsSpinner = spinner();
	dnsSpinner.start('Setting up custom domain...');

	// Set up custom domain
	const dnsResponse = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/pages/projects/prod-biscuits-${appId}-app/domains`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
			},
			body: JSON.stringify({
				name: `${appId}.biscuits.club`,
			}),
		},
	);
	const dnsData = await dnsResponse.json();
	if (!dnsResponse.ok) {
		dnsSpinner.stop('Failed to set up custom domain');
		outro(dnsData.errors.map((error) => error.message).join(', '));
		process.exit(1);
	}

	// now we provision the record on biscuits.club
	const recordResponse = await fetch(
		`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
			},
			body: JSON.stringify({
				type: 'CNAME',
				name: `${appId}.biscuits.club`,
				content: `prod-biscuits-${appId}-app.pages.dev`,
				proxied: true,
			}),
		},
	);

	dnsSpinner.stop('Custom domain set up');
}

outro(`Link: https://${appId}.biscuits.club`);
