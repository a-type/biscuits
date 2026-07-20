import {
	useLocation,
	useRouterState,
	useSearch,
	useNavigate as useTanstackNavigate,
	useParams as useTanstackParams,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export function useNavigate() {
	const navigate = useTanstackNavigate();
	return (toOrOptions: string | Record<string, unknown>, options?: any) => {
		if (typeof toOrOptions === 'string') {
			return navigate({ to: toOrOptions, ...(options ?? {}) } as any);
		}
		return navigate(toOrOptions as any);
	};
}

export function useParams<T = Record<string, string>>(options?: any): T {
	if (options) {
		return useTanstackParams(options) as T;
	}
	const matches = useRouterState({
		select: (state) => state.matches,
	});
	const merged = Object.assign({}, ...matches.map((match) => match.params));
	return merged as T;
}

export function useSearchParams() {
	const search = useSearch({ strict: false }) as Record<string, unknown>;
	const navigate = useTanstackNavigate();
	const params = toSearchParams(search);

	const setParams = (
		updater: (params: URLSearchParams) => URLSearchParams | void,
	) => {
		const nextParams = new URLSearchParams(params.toString());
		const result = updater(nextParams);
		const finalParams = result instanceof URLSearchParams ? result : nextParams;
		const nextSearch = Object.fromEntries(finalParams.entries());
		navigate({
			replace: true,
			search: (prev: Record<string, unknown>) => {
				const merged: Record<string, unknown> = { ...prev, ...nextSearch };
				for (const key of Object.keys(prev)) {
					if (!finalParams.has(key)) {
						merged[key] = undefined;
					}
				}
				return merged;
			},
		} as any);
	};

	return [params, setParams] as const;
}

export function useOnLocationChange(handler: () => void) {
	const location = useLocation();
	useEffect(() => {
		handler();
	}, [location.pathname, location.searchStr, handler]);
}

export function useIsRouteTransitioning(delay = 0) {
	const isTransitioning = useRouterState({
		select: (state) => state.isLoading,
	});
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!isTransitioning) {
			setVisible(false);
			return;
		}
		if (delay <= 0) {
			setVisible(true);
			return;
		}
		const timeout = setTimeout(() => setVisible(true), delay);
		return () => clearTimeout(timeout);
	}, [delay, isTransitioning]);

	return visible;
}

function toSearchParams(search: Record<string, unknown>) {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(search)) {
		if (value === undefined || value === null) {
			continue;
		}
		if (Array.isArray(value)) {
			for (const item of value) {
				params.append(key, String(item));
			}
			continue;
		}
		params.set(key, String(value));
	}
	return params;
}
