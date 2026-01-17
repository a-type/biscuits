import { ReactNode } from 'react';

export interface IngredientListProps {
	children?: ReactNode;
}

export function IngredientList({ children }: IngredientListProps) {
	return <ul className="m-0 pl-4">{children}</ul>;
}

export function IngredientListItem({ children }: IngredientListProps) {
	return (
		<li>
			<div className="mb-3 flex flex-col items-start gap-2">{children}</div>
		</li>
	);
}
