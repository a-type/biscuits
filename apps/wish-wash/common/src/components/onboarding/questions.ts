export type OnboardingQuestion = {
	id: string;
	question: string;
	options?: string[];
	suggestions: string[];
};

export const onboardingQuestions: OnboardingQuestion[] = [
	{
		id: 'sweet-treat',
		question: 'What is your favorite sweet treat?',
		suggestions: [
			'Dark chocolate',
			'Apple pie',
			'Lemon cookies',
			'Pumpkin bread',
		],
	},
	{
		id: 'coffee-order',
		question: 'What is your go-to coffee order?',
		suggestions: ['Black coffee', 'Latte', 'Cappuccino', 'Cold brew'],
	},
	{
		id: 'favorite-color',
		question: 'What are your favorite colors?',
		suggestions: ['Blue', 'Red', 'Purple', 'Rainbow'],
	},
	{
		id: 'cuisine',
		question: 'What restaurants do you visit frequently?',
		suggestions: [
			'Sushi',
			'Oakwood Pizza Box',
			'Costco Food Court',
			'Chipotle',
		],
	},
	{
		id: 'hobbies',
		question: 'What are your favorite hobbies?',
		suggestions: ['Reading', 'Knitting', 'Gardening', 'Cooking'],
	},
	{
		id: 'new-hobby',
		question: 'What new hobby would you like to try?',
		suggestions: ['Painting', 'Pottery', 'Baking', 'Yoga'],
	},
	{
		id: 'beverages',
		question: 'Do you drink? If so, what do you like?',
		suggestions: [
			'Nope',
			'Cabernet Sauvignon',
			'German lagers',
			'Kentucky bourbon',
		],
	},
	{
		id: 'music',
		question: 'What music do you like to listen to?',
		suggestions: ['Pop', 'Jazz', 'Classical', 'Metal'],
	},
	{
		id: 'books',
		question: 'What books do you like to read?',
		suggestions: ['Mystery', 'Fantasy', 'Science fiction', 'Biography'],
	},
	{
		id: 'movies',
		question: 'What movies do you like to watch?',
		suggestions: ['Action', 'Comedy', 'Romance', 'Documentary'],
	},
	{
		id: 'games',
		question: 'What games do you like to play?',
		suggestions: ['Board games', 'Video games', 'Card games', 'Puzzles'],
	},
	{
		id: 'sports',
		question: 'What sports do you play?',
		suggestions: ['Basketball', 'Soccer', 'Golf', 'Tennis'],
	},
];
