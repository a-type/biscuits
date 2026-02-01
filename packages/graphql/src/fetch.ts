import { createFetch } from '@a-type/auth-fetch';
import { BiscuitsError } from '@biscuits/error';
import { API_ORIGIN, HOME_ORIGIN } from './config.js';

export { refreshSession } from '@a-type/auth-fetch';

export const fetch = createFetch({
	readBody: true,
	refreshSessionEndpoint: `${API_ORIGIN}/auth/refresh`,
	logoutEndpoint: `${API_ORIGIN}/auth/logout`,
	isSessionExpired: (res, body) => {
		console.debug('Checking for session expiration...', res, body);
		const biscuitsError =
			BiscuitsError.readResponse(res) || BiscuitsError.readResponseBody(body);
		if (biscuitsError) {
			console.error('Biscuits Error', biscuitsError);
			return biscuitsError.code === BiscuitsError.Code.SessionExpired;
		}
		return false;
	},
	headers: {
		'x-csrf-token': 'csrf',
	},
});

export function login() {
	window.location.href =
		HOME_ORIGIN +
		'/login' +
		'?returnTo=' +
		encodeURIComponent(window.location.href);
}
