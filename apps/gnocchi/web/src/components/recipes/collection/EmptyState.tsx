import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import { useIsFiltered } from '@/components/recipes/collection/hooks.js';
import { Icon, P } from '@a-type/ui';
import classNames from 'classnames';
import { Suspense } from 'react';
import cls from './EmptyState.module.css';

export interface EmptyStateProps {
	className?: string;
}

export function EmptyState({ className }: EmptyStateProps) {
	const isFiltered = useIsFiltered();

	if (isFiltered) {
		return (
			<div className={classNames(cls.root, className)}>
				<Icon name="filter" size={120} className={cls.icon} />
				<P>No recipes match your search.</P>
			</div>
		);
	}

	return (
		<div className={classNames(cls.root, className)}>
			<Icon name="book" size={120} className={cls.icon} />
			<P>There are no recipes in your collection.</P>
			<Suspense>
				<RecipeCreateButton />
			</Suspense>
		</div>
	);
}
