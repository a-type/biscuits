import { AddToListDialog } from '@/components/recipes/viewer/AddToListDialog.jsx';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { Button, ButtonProps, DialogTrigger } from '@a-type/ui';
import { OnboardingTooltip } from '@biscuits/client';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { Suspense } from 'react';

export interface AddToListButtonProps extends ButtonProps {
	recipe: Recipe;
	listId?: string | null;
}

export function AddToListButton({
	recipe,
	children,
	listId = null,
	className,
	...rest
}: AddToListButtonProps) {
	return (
		<OnboardingTooltip
			content={
				<div>Use this button to add ingredients to your grocery list.</div>
			}
			onboarding={saveHubRecipeOnboarding}
			step="addToList"
			disableNext
			// prevent interactions inside the dialog
			// from skipping the step
			ignoreOutsideInteraction={(el) => !!el.closest('[role="dialog"]')}
		>
			<div className={className}>
				<Suspense
					fallback={
						<Button disabled {...rest}>
							{children || 'Add to list'}
						</Button>
					}
				>
					<AddToListDialog recipe={recipe} listId={listId}>
						<DialogTrigger asChild>
							<Button emphasis="default" {...rest}>
								{children || 'Add to list'}
							</Button>
						</DialogTrigger>
					</AddToListDialog>
				</Suspense>
			</div>
		</OnboardingTooltip>
	);
}
