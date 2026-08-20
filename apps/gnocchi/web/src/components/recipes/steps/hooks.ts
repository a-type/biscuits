import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useCallback } from 'react';
import { isActiveCookingSession, useCookSessionAction } from '../hooks.js';

export function useMaybeCookingSession(maybeRecipe: Recipe | null | undefined) {
	hooks.useWatch(maybeRecipe || null);
	let maybeSession = maybeRecipe?.get('session') ?? null;
	if (!isActiveCookingSession(maybeSession)) {
		maybeSession = null;
	}
	hooks.useWatch(maybeSession);
	return maybeSession;
}

export function useStepAssignment(
	stepId: string | undefined,
	maybeRecipe: Recipe | null | undefined,
) {
	const maybeSession = useMaybeCookingSession(maybeRecipe);
	const maybeAssignments = maybeSession
		? maybeSession.get('instructionAssignments')
		: null;
	hooks.useWatch(maybeAssignments);

	const sessionAction = useCookSessionAction(maybeRecipe || null);

	const assignedPersonId = stepId
		? maybeAssignments?.get(stepId) ?? null
		: null;

	const assignPersonId = useCallback(
		(personId: string | null) => {
			if (!stepId) return;
			if (!maybeAssignments) {
				if (maybeRecipe && personId) {
					maybeRecipe.set('session', {
						instructionAssignments: {
							[stepId]: personId,
						},
					});
				}
				return;
			}

			sessionAction((session) => {
				if (personId) {
					session?.get('instructionAssignments').set(stepId, personId);
				} else {
					session?.get('instructionAssignments').delete(stepId);
				}
			});
		},
		[maybeAssignments, stepId, maybeRecipe, sessionAction],
	);

	const self = hooks.useSelf();

	return {
		assignedPersonId,
		assignPersonId,
		isAssignedToMe: assignedPersonId === self.id,
	};
}

export function useStepCompleted(
	stepId: string | undefined,
	maybeRecipe: Recipe | null | undefined,
) {
	const maybeSession = useMaybeCookingSession(maybeRecipe);
	const maybeCompletedSteps = maybeSession
		? maybeSession.get('completedInstructions')
		: null;
	hooks.useWatch(maybeCompletedSteps);

	const completed = stepId && maybeCompletedSteps?.has(stepId);

	const sessionAction = useCookSessionAction(maybeRecipe || null);

	const setCompleted = useCallback(
		(completed: boolean) => {
			if (!stepId) return;
			if (!maybeCompletedSteps) {
				if (maybeRecipe && completed) {
					maybeRecipe.set('session', {
						completedInstructions: [stepId],
					});
				}
				return;
			}

			sessionAction((session) => {
				if (completed) {
					session?.get('completedInstructions').add(stepId);
				} else {
					session?.get('completedInstructions').removeAll(stepId);
				}
			});
		},
		[maybeCompletedSteps, stepId, maybeRecipe, sessionAction],
	);

	return {
		completed,
		setCompleted,
	};
}

export function useStepImage(
	stepId: string | undefined,
	maybeRecipe: Recipe | null | undefined,
) {
	const maybeStepImages = maybeRecipe?.get('stepImages') ?? null;
	hooks.useWatch(maybeStepImages);

	const stepImage = stepId ? maybeStepImages?.get(stepId) ?? null : null;

	const setStepImage = useCallback(
		(file: File | null) => {
			if (!stepId || !maybeRecipe) return;

			if (file) {
				maybeRecipe.get('stepImages').set(stepId, file);
			} else {
				maybeRecipe.get('stepImages').delete(stepId);
			}
		},
		[stepId, maybeRecipe],
	);

	return {
		stepImage,
		setStepImage,
	};
}
