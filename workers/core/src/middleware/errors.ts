import { AuthError } from '@a-type/auth';
import { BiscuitsError } from '@biscuits/error';
import { ZodError } from 'zod';

export function handleError(reason: unknown): Response {
	if (reason instanceof AuthError) {
		if (reason.message === 'Session expired') {
			const biscuitsExpired = new BiscuitsError(
				BiscuitsError.Code.SessionExpired,
			);
			return new Response(JSON.stringify(biscuitsExpired.body), {
				status: biscuitsExpired.statusCode,
				headers: {
					'Content-Type': 'application/json',
					...biscuitsExpired.headers,
				},
			});
		} else if (reason.statusCode === 409) {
			const biscuitsError = new BiscuitsError(
				BiscuitsError.Code.Conflict,
				'You have an account with a different login method. Try logging in with a different method.',
			);
			return new Response(JSON.stringify(biscuitsError.body), {
				status: biscuitsError.statusCode,
				headers: {
					'Content-Type': 'application/json',
					...biscuitsError.headers,
				},
			});
		} else if (reason.statusCode === 401) {
			// TODO: redirect to login?
			const biscuitsError = new BiscuitsError(
				BiscuitsError.Code.Unauthorized,
				'Unauthorized',
			);
			return new Response(JSON.stringify(biscuitsError.body), {
				status: biscuitsError.statusCode,
				headers: {
					'Content-Type': 'application/json',
					...biscuitsError.headers,
				},
			});
		}
	}

	if (BiscuitsError.isInstance(reason)) {
		if (reason.code >= BiscuitsError.Code.Unexpected) {
			console.error('Unexpected BiscuitsError:', reason);
		}
		return new Response(JSON.stringify(reason.body), {
			status: reason.statusCode,
			headers: {
				'Content-Type': 'application/json',
				...reason.headers,
			},
		});
	}

	if (reason instanceof ZodError) {
		return new Response(JSON.stringify(reason.issues), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
				'x-biscuits-error': BiscuitsError.Code.BadRequest.toString(),
			},
		});
	}

	console.error('Unknown error:', reason);
	return new Response('Internal Server Error', {
		status: 500,
		headers: {
			'Content-Type': 'text/plain',
			'x-biscuits-error': BiscuitsError.Code.Unexpected.toString(),
		},
	});
}
