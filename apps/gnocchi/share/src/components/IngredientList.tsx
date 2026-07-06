import { Box, Heading, Note, Ul } from '@a-type/ui';
import { ReactNode } from 'react';

export interface IngredientListProps {
	children?: ReactNode;
}

export function IngredientList({ children }: IngredientListProps) {
	return <Ul>{children}</Ul>;
}

export function IngredientListItem({
	children,
	note,
}: {
	children?: ReactNode;
	note?: string;
}) {
	return (
		<Ul.Item>
			<Box col items="start" gap="xs">
				{children}
			</Box>
			{note && <Note>{note}</Note>}
		</Ul.Item>
	);
}

export function IngredientListHeading({ children }: IngredientListProps) {
	return <Heading emphasis="ambient">{children}</Heading>;
}
