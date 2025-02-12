import { useLocalStorage } from '@biscuits/client';
import { use, useEffect } from 'react';
import { proxy, useSnapshot } from 'valtio';

const lastKnownLocation = proxy({
	value: null as { latitude: number; longitude: number } | null,
});

export async function getGeolocation() {
	if (lastKnownLocation.value) {
		return lastKnownLocation.value;
	}
	const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
	return (lastKnownLocation.value = {
		latitude: pos.coords.latitude,
		longitude: pos.coords.longitude,
	});
}

let permissionPromise = innerHasGeolocationPermission();
async function innerHasGeolocationPermission(): Promise<boolean> {
	const value =
		'geolocation' in navigator &&
		'permissions' in navigator &&
		(await navigator.permissions.query({ name: 'geolocation' })).state ===
			'granted';
	console.debug('Geolocation permission:', value);
	return value;
}

export async function hasGeolocationPermission(): Promise<boolean> {
	permissionPromise ??= innerHasGeolocationPermission();
	return permissionPromise;
}

export const hasLocationAbility = 'geolocation' in navigator;

export function useHasGeolocationPermission() {
	return use(permissionPromise);
}

export function useGeolocation() {
	const hasAccess = useHasGeolocationPermission();

	useEffect(() => {
		if (hasAccess) {
			const watch = navigator.geolocation.watchPosition((v) => {
				lastKnownLocation.value = {
					latitude: v.coords.latitude,
					longitude: v.coords.longitude,
				};
			});
			return () => navigator.geolocation.clearWatch(watch);
		}
	}, [hasAccess]);

	return useSnapshot(lastKnownLocation).value;
}

export const LOCATION_BROAD_SEARCH_RADIUS = 0.01; // 10km

export function distance(
	{ latitude: lat1, longitude: lon1 }: { longitude: number; latitude: number },
	{ latitude: lat2, longitude: lon2 }: { longitude: number; latitude: number },
) {
	const R = 6371e3; // metres
	const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lon2 - lon1) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const d = R * c; // in metres
	return d;
}

export function useHasDeniedGeolocation() {
	return useLocalStorage('locationPermissionDenied', false, false);
}

export const locationRequestDialogState = proxy({
	show: false,
});
