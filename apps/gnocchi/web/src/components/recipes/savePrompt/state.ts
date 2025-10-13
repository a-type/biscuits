import { proxy } from 'valtio';

export const recipeSavePromptState = proxy({
	url: '',
	slug: '',
	title: '',
});
