import {
	createContext,
	ReactNode,
	useContext,
	useDeferredValue,
	useState,
} from 'react';
import {
	SuggestionGroup,
	useAddBarSuggestions as useComputeSuggestions,
} from './hooks.js';

const SuggestionContext = createContext<{
	suggestionPrompt: string;
	setSuggestionPrompt: (prompt: string) => void;
	groupedSuggestions: SuggestionGroup[];
	placeholder: string;
}>({
	suggestionPrompt: '',
	setSuggestionPrompt: () => {},
	groupedSuggestions: [],
	placeholder: 'Add an item...',
});

export const AddBarSuggestionProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [prompt, setPrompt] = useState('');
	const deferredPrompt = useDeferredValue(prompt, '');
	const { groupedSuggestions, placeholder } = useComputeSuggestions({
		showRichSuggestions: true,
		suggestionPrompt: deferredPrompt,
	});

	return (
		<SuggestionContext.Provider
			value={{
				suggestionPrompt: prompt,
				setSuggestionPrompt: setPrompt,
				groupedSuggestions,
				placeholder,
			}}
		>
			{children}
		</SuggestionContext.Provider>
	);
};

export function useAddBarSuggestions() {
	return useContext(SuggestionContext);
}
