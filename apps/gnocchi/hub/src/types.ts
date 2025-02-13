export interface HubRecipeData {
	id: string;
	title: string;
	prelude: {
		type: 'doc';
		content: ParagraphNode[];
	};
	mainImageUrl: string;
	ingredients: GnocchiIngredient[];
	// tiptap/prosemirror content
	instructions: {
		type: 'doc';
		content: (StepNode | SectionTitleNode)[];
	};
	publisher: {
		fullName: string;
	};
	note?: string;
	servings?: number;
	prepTimeMinutes?: number;
	cookTimeMinutes?: number;
	totalTimeMinutes?: number;
	embeddedRecipes: Record<string, HubRecipeData>;
}

type GnocchiIngredient = {
	text: string;
	comments: string[];
	quantity: number;
	unit?: string;
	isSectionHeader: boolean;
	food: string;
	id: string;
	note: string | null;
};

type StepNode = {
	type: 'step';
	content: TextNode[];
	attrs: {
		id: string;
		note?: string;
	};
};

type SectionTitleNode = {
	type: 'sectionTitle';
	content: TextNode[];
	attrs: {
		id: string;
		note?: string;
	};
};

type TextNode = {
	type: 'text';
	text: string;
};

type ParagraphNode = {
	type: 'paragraph';
	content: TextNode[];
};
