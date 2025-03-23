import { gnocchiListNotifications } from './gnocchi.js';
import { postDeleteTracker } from './post.js';

export const changeHandlers = [
	gnocchiListNotifications,
	// gnocchiRecipeInvalidate,
	postDeleteTracker,
];
