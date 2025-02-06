export type AppManifest<Id extends string> = {
	id: Id;
	url: string;
	name: string;
	description: string;
	mainImageUrl?: string;
	iconPath: string;
	size?: number;
	devOriginOverride: string;
	demoVideoSrc: string;
	paidDescription: string;
	paidFeatures: PaidFeature[] | readonly PaidFeature[];
	prerelease?: boolean;
};

export type PaidFeature = {
	imageUrl: string;
	description: string;
	title: string;
	family?: boolean;
};

export const apps = [
	{
		id: 'gnocchi',
		url: 'https://gnocchi.biscuits.club',
		name: 'Gnocchi',
		description: 'Organize your weekly cooking and groceries',
		mainImageUrl: 'https://gnocchi.biscuits.club/og-image.png',
		iconPath: 'android-chrome-512x512.png',
		size: 4,
		devOriginOverride: 'http://localhost:6220',
		demoVideoSrc: '/videos/gnocchi-compressed.mp4',
		paidFeatures: [
			{
				imageUrl: '/images/gnocchi/scanner.png',
				title: 'Recipe Scanner',
				description:
					'Scan web recipes to create a personal copy. Add notes, make changes, and collaborate on cooking with other plan members.',
			},
			{
				imageUrl: '/images/gnocchi/groceries-collaboration.png',
				title: 'Collaborative Groceries',
				description:
					'Share your groceries list with other plan members and stay on the same page. Shopping gets more efficient with realtime presence and progress updates.',
				family: true,
			},
			{
				imageUrl: '/images/gnocchi/recipe-collaboration.png',
				title: 'Sous Chef Mode',
				description:
					'Team up with other plan members to cook a recipe together. Assign steps and track progress with instant updates.',
				family: true,
			},
		],
		paidDescription:
			'Your personal cooking app becomes a family groceries list and recipe box.',
	} as AppManifest<'gnocchi'>,
	{
		id: 'trip-tick',
		url: 'https://trip-tick.biscuits.club',
		name: 'Trip Tick',
		description: 'The smartest packing list for your next trip',
		iconPath: 'icon.png',
		size: 2,
		devOriginOverride: 'http://localhost:6221',
		demoVideoSrc: '/videos/trip-tick-compressed.mp4',
		paidFeatures: [
			{
				imageUrl: '/images/trip-tick/weather.png',
				title: 'Weather Forecast',
				description:
					'Get weather forecasts for your destination over the duration of your trip.',
			},
			{
				imageUrl: '/images/trip-tick/conditions.png',
				title: 'Powerful Conditions',
				description:
					'Define conditions for packing list items based on predicted weather to make sure you have everything you need.',
			},
		],
		paidDescription:
			'Now everyone can be on the same page when packing. Plus, get a weather forecast and more powerful trip planning tools.',
	} as AppManifest<'trip-tick'>,
	{
		id: 'wish-wash',
		demoVideoSrc: '',
		description: 'TODO',
		devOriginOverride: 'http://localhost:6222',
		iconPath: 'icon.png',
		name: 'Wish Wash',
		paidDescription: 'TODO',
		paidFeatures: [],
		url: 'https://wish-wash.biscuits.club',
		prerelease: true,
	} as AppManifest<'wish-wash'>,
	{
		id: 'marginalia',
		demoVideoSrc: '',
		description: 'TODO',
		devOriginOverride: 'http://localhost:6223',
		iconPath: 'icon.png',
		name: 'Marginalia',
		paidDescription: 'TODO',
		paidFeatures: [],
		url: 'https://marginalia.biscuits.club',
		prerelease: true,
	} as AppManifest<'marginalia'>,
	{
		id: 'star-chart',
		demoVideoSrc: '',
		description: 'TODO',
		devOriginOverride: 'http://localhost:6224',
		iconPath: 'icon.png',
		name: 'Star Chart',
		paidDescription: 'TODO',
		paidFeatures: [],
		url: 'https://star-chart.biscuits.club',
		prerelease: true,
	} as AppManifest<'star-chart'>,
	{
		id: 'humding',
		demoVideoSrc: '',
		description: 'An app for playing it by ear',
		devOriginOverride: 'http://localhost:6225',
		iconPath: 'icon.png',
		name: 'Humding',
		paidDescription:
			'Share your songs with others and sync to all your devices',
		paidFeatures: [],
		url: 'https://humding.biscuits.club',
		prerelease: true,
	} as AppManifest<'humding'>,
	{
		id: 'palette',
		demoVideoSrc: '/videos/palette-compressed.mp4',
		description: 'Paint what you see',
		devOriginOverride: 'http://localhost:6226',
		iconPath: 'icon.png',
		name: 'Palette',
		paidDescription: 'Sync your projects across all your devices',
		paidFeatures: [],
		url: 'https://palette.biscuits.club',
		prerelease: false,
	},
	{
		id: 'names',
		name: 'Names',
		iconPath: 'icon.png',
		description: "Remember people's names",
		url: 'https://names.biscuits.club',
		devOriginOverride: 'http://localhost:6227',
		demoVideoSrc: '',
		paidDescription:
			'Sync names with your devices and share with family, plus location-based search',
		paidFeatures: [
			{
				imageUrl: '',
				title: 'Location-Based Search',
				description:
					'Automatically record where you are when you add a name, so you can search later by where you met someone.',
			},
			{
				imageUrl: '',
				title: 'Family Sharing',
				description:
					'Share names with family members so you can all remember together.',
				family: true,
			},
			{
				imageUrl: '',
				title: 'Sync Across Devices',
				description: 'Access your names on all your devices.',
			},
		],
		prerelease: true,
	},
] as const;

export type AppId = (typeof apps)[number]['id'];

export const appIds = apps.map((app) => app.id) as AppId[];
export function isValidAppId(appId: string): appId is AppId {
	return appIds.includes(appId as AppId);
}

export const appsById = Object.fromEntries(
	apps.map((app) => [app.id, app]),
) as Record<AppId, (typeof apps)[number]>;

export function getAppUrl(app: AppManifest<AppId>) {
	if (import.meta.env.DEV) {
		return app.devOriginOverride;
	}
	return app.url;
}

declare global {
	interface ImportMetaEnv {
		DEV: boolean;
	}
	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}
