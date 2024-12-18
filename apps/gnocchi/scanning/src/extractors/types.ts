export interface ExtractorData {
	title?: string | null;
	description?: string | null;
	image?: string | null;
	author?: string | null;
	copyrightHolder?: string | null;
	copyrightYear?: string | null;
	url?: string | null;
	rawIngredients?: string[];
	steps?: string[];
	detailedIngredients?: {
		original: string;
		quantity: number;
		unit?: string | null;
		foodName: string;
		comments?: string[];
		preparations?: string[];
		// gnocchi-specific
		note?: string;
		isSectionHeader?: boolean;
	}[];
	detailedSteps?: DetailedStep[];
	cookTimeMinutes?: number | null;
	prepTimeMinutes?: number | null;
	totalTimeMinutes?: number | null;
	servings?: number | null;
	// gnocchi-specific
	note?: string;
	scanner: string;
}

export interface DetailedStep {
	type: 'step' | 'sectionTitle';
	content: string;
	note?: string;
}
