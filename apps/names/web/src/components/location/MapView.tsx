import { getResolvedColorMode } from '@biscuits/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

export interface MapViewProps {
	location: { latitude: number; longitude: number };
	className?: string;
}

export function MapView({
	location: { longitude, latitude },
	className,
}: MapViewProps) {
	const mapContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const token = import.meta.env.VITE_MAPBOX_TOKEN;
		if (!token) {
			return;
		}

		const container = mapContainerRef.current;
		if (!container) {
			return;
		}

		container.classList.add('map-container');

		try {
			const colorMode = getResolvedColorMode();
			const map = new mapboxgl.Map({
				container,
				center: [longitude, latitude], // starting position [lng, lat]
				zoom: 10, // starting zoom
				accessToken: token,
				style:
					colorMode === 'light' ?
						'mapbox://styles/gforrest/cm72e4rt0006z01quhbsb3i3n'
					:	'mapbox://styles/gforrest/cm72e67fr002501qq7dyh6jsy',
			});
			map.addControl(
				new mapboxgl.GeolocateControl({
					trackUserLocation: true,
					fitBoundsOptions: {
						minZoom: 9,
						maxZoom: 15,
					},
				}),
			);
			const marker = new mapboxgl.Marker({
				color: 'var(--color-primary-dark)',
			})
				.setLngLat([longitude, latitude])

				.addTo(map);
			const observer = new ResizeObserver(() => {
				map.resize();
			});
			observer.observe(container);
			return () => {
				map.remove();
				observer.disconnect();
			};
		} catch (err) {
			console.error('Error creating map', err);
		}
	}, [longitude, latitude]);

	return <div ref={mapContainerRef} className={className} />;
}

export default MapView;
