import { createContext, useContext } from 'react';
import { ProjectAnalysis } from './hooks.js';

export const AnalysisContext = createContext<ProjectAnalysis>({
	upstreams: {},
	downstreams: {},
});

export function useAnalysis() {
	return useContext(AnalysisContext);
}
