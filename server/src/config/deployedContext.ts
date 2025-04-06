export const DEPLOYED_ORIGIN =
	process.env.HOST || `http://localhost:${process.env.PORT ?? '6124'}`;
export const UI_ORIGIN = process.env.UI_ORIGIN || 'http://localhost:6123';
export const PORT = process.env.PORT || DEPLOYED_ORIGIN.split(':')[2];
export const ENVIRONMENT = process.env.NODE_ENV || 'development';

export const GNOCCHI_HUB_ORIGIN =
	process.env.GNOCCHI_HUB_ORIGIN || 'http://localhost:6124/gnocchi/hub';
export const WISH_WASH_HUB_ORIGIN =
	process.env.WISH_WASH_HUB_ORIGIN || 'http://localhost:6124/wish-wash/hub';
export const POST_HUB_ORIGIN =
	process.env.POST_HUB_ORIGIN || 'http://localhost:6124/post/hub';
