export type OnboardingQuestion = {
	id: string;
	question: string;
	options?: string[];
	suggestions: string[];
	prompt: string;
};

export const onboardingQuestions: OnboardingQuestion[] = [
	{
		id: 'sweet-treat',
		question: 'What is your favorite sweet treat?',
		prompt: 'Favorite sweet treat',
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
		prompt: 'Go-to coffee order',
		suggestions: ['Black coffee', 'Latte', 'Cappuccino', 'Cold brew'],
	},
	{
		id: 'favorite-color',
		question: 'What are your favorite colors?',
		prompt: 'Favorite color(s)',
		suggestions: ['Blue', 'Red', 'Purple', 'Rainbow'],
	},
	{
		id: 'cuisine',
		question: 'What restaurants do you visit frequently?',
		prompt: 'Favorite restaurants',
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
		prompt: 'Favorite hobbies',
		suggestions: ['Reading', 'Knitting', 'Gardening', 'Cooking'],
	},
	{
		id: 'new-hobby',
		question: 'What new hobby would you like to try?',
		prompt: "New hobby I'd like to try",
		suggestions: ['Painting', 'Pottery', 'Baking', 'Yoga'],
	},
	{
		id: 'beverages',
		question: 'Do you drink? If so, what do you like?',
		prompt: 'Favorite drink(s)',
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
		prompt: 'Favorite music genre',
		suggestions: ['Pop', 'Jazz', 'Classical', 'Metal'],
	},
	{
		id: 'books',
		question: 'What books do you like to read?',
		prompt: 'Favorite books',
		suggestions: ['Mystery', 'Fantasy', 'Science fiction', 'Biography'],
	},
	{
		id: 'movies',
		question: 'What movies do you like to watch?',
		prompt: 'Favorite movie genre(s)',
		suggestions: ['Action', 'Comedy', 'Romance', 'Documentary'],
	},
	{
		id: 'games',
		question: 'What games do you like to play?',
		prompt: 'Favorite kinds of games',
		suggestions: ['Board games', 'Video games', 'Card games', 'Puzzles'],
	},
	{
		id: 'sports',
		question: 'What sports do you play?',
		prompt: 'Played sport(s)',
		suggestions: ['Basketball', 'Soccer', 'Golf', 'Tennis'],
	},
];
