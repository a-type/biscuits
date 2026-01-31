export function isAppAllowed(
	planAllowedAppValue: string | null | undefined,
	appId: string,
) {
	// TODO: systemitize this
	if (appId === 'wish-wash') {
		return true;
	}
	if (!planAllowedAppValue || planAllowedAppValue === '*') {
		return true;
	}
	return planAllowedAppValue === appId;
}
