import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';

const SNAPSHOT_MATCH = /window\.__SNAPSHOT__\s+=\s+(.*);/;

export async function gnocchi($: CheerioAPI): Promise<ExtractorData | null> {
	const scripts = $('script');

	const s = scripts.filter((i, el) => {
		const text = $(el).text();
		return SNAPSHOT_MATCH.test(text);
	});

	if (!s.length) {
		return null;
	}

	const snapshot = SNAPSHOT_MATCH.exec($(s).text())?.[1];
	if (!snapshot) {
		return null;
	}

	const data = JSON.parse(snapshot);

	return {
		scanner: 'gnocchi',
		title: data.title,
		image: data.mainImageUrl,
		author: data.publisher.fullName,
		detailedIngredients: data.ingredients.map((i: any) => ({
			original: i.text,
			quantity: i.quantity,
			unit: i.unit,
			foodName: i.food,
			note: i.note,
			comments: i.comments,
		})),
		detailedSteps: data.instructions.content.map((i: any) => ({
			type: i.type === 'sectionTitle' ? 'sectionTitle' : 'step',
			content: i.content.reduce((acc: string, j: any) => acc + j.text, ''),
			note: i.attrs.note,
		})),
		servings: data.servings,
		prepTimeMinutes: data.prepTimeMinutes,
		cookTimeMinutes: data.cookTimeMinutes,
		totalTimeMinutes: data.totalTimeMinutes,
		note: data.note,
	};
}
