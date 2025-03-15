import { getResolvedColorMode } from '@biscuits/client';
import Picker from '@emoji-mart/react';

export interface EmojiImagePickerProps {
	onSelect: (image: File) => void;
}

export function EmojiImagePicker({ onSelect }: EmojiImagePickerProps) {
	const convert = async (emoji: {
		id: string;
		name: string;
		native: string;
		unified: string;
		keywords: unknown;
		shortcodes: string[];
	}) => {
		const image = await renderToImage(emoji.native);
		onSelect(image);
	};
	return (
		// @ts-expect-error - library types are wrong but also useless anyway
		<Picker
			data={fetchData}
			onEmojiSelect={convert}
			theme={getResolvedColorMode()}
		/>
	);
}

async function fetchData() {
	const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');

	return response.json();
}

async function renderToImage(emoji: string) {
	const canvas = document.createElement('canvas');
	const size = 256;
	const fontSize = (size * 92) / 128;
	const x = (size * 1) / 128;
	const y = (size * 100) / 128;
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Failed to create canvas context');
	ctx.font = `${fontSize}px serif`;
	ctx.fillText(emoji, x, y);
	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(resolve),
	);
	if (!blob) {
		throw new Error('Failed to render emoji to image');
	}
	return new File([blob], 'emoji.png');
}
