import { toast } from '@a-type/ui';
import { defaultErrorHandlerRef } from '@biscuits/graphql';

let callback: (message: string) => boolean | void = (message: string) => {
	toast.error(message);
	return true;
};

export function onPageError(cb: (message: string) => void) {
	callback = cb;
}

// reads 'error' query string on page load and
// calls the callback with the error message
export function readErrorFromQuery() {
	const urlParams = new URLSearchParams(window.location.search);
	const error = urlParams.get('error');
	if (error) {
		// give the app a moment to register a handler
		setTimeout(() => {
			let result = callback(error);
			if (result) {
				urlParams.delete('error');
				window.history.replaceState(
					{},
					'',
					`${window.location.pathname}?${urlParams}`,
				);
			}
		}, 100);
	}
}

if (typeof window !== 'undefined') {
	window.addEventListener('load', readErrorFromQuery);
}

// there's not really a place to put this, so we'll just put it here.
// connects the default graphql client error handler to toasts.
defaultErrorHandlerRef.onError = toast.error;
