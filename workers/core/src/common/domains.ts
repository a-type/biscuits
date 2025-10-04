export function getRootDomain(url: string) {
	const parsed = new URL(url);
	const domainParts = parsed.hostname.split('.');
	if (domainParts.length > 2) {
		return domainParts.slice(-2).join('.');
	}
	return parsed.hostname;
}
