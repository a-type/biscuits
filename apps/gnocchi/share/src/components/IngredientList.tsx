import { Note } from '@a-type/ui';
import { ReactNode } from 'react';

export interface IngredientListProps {
	children?: ReactNode;
}

export function IngredientList({ children }: IngredientListProps) {
	return <ul className="m-0 pl-md">{children}</ul>;
}

export function IngredientListItem({
	children,
	note,
}: {
	children?: ReactNode;
	note?: string;
}) {
	return (
		<li>
			<div className="mb-sm flex flex-col items-start gap-xs">{children}</div>
			{note && <Note>{note}</Note>}
		</li>
	);
}

export function IngredientListHeading({ children }: IngredientListProps) {
	return <h3 className="mb-md text-sm font-bold">{children}</h3>;
}
