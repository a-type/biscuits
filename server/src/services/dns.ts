import { lookup } from 'node:dns';
import { URL } from 'node:url';
import { promisify } from 'node:util';
import { DEPLOYED_ORIGIN } from '../config/deployedContext.js';

const lookupPromise = promisify(lookup);

export async function doesHostnameRouteToThisServer(hostname: string) {
	const serverHost = new URL(DEPLOYED_ORIGIN).hostname;
	return doesHostnameResolveMatch(hostname, serverHost);
}

export async function doesHostnameRouteToCustomDnsHost(hostname: string) {
	return doesHostnameResolveMatch(hostname, 'custom-dns.biscuits.club');
}

export async function doesHostnameResolveMatch(
	hostnameA: string,
	hostnameB: string,
) {
	const [a, b] = await Promise.allSettled([
		lookupPromise(hostnameA),
		lookupPromise(hostnameB),
	]);
	if (a.status === 'rejected' || b.status === 'rejected') {
		return false;
	}
	const aResult = a.value;
	const bResult = b.value;
	return aResult.address === bResult.address;
}
