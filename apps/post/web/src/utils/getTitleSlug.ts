export function getTitleSlug(title: string) {
	return title
		.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.slice(0, 50);
}
