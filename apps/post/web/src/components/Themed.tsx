import { hooks } from '@/hooks.js';
import { SlotDiv } from '@a-type/ui';
import { ReactNode } from 'react';

export function Themed({
	notebookId,
	children,
	asChild,
}: {
	notebookId: string;
	children?: ReactNode;
	asChild?: boolean;
}) {
	const notebook = hooks.useNotebook(notebookId);
	hooks.useWatch(notebook);
	const theme = notebook?.get('theme') ?? null;
	hooks.useWatch(theme);
	const { primaryColor, fontStyle } = theme?.getAll() ?? {
		spacing: 'md',
		primaryColor: 'blueberry',
		fontStyle: 'sans-serif',
	};
	if (!notebook) return <SlotDiv asChild={asChild}>{children}</SlotDiv>;
	return (
		<SlotDiv
			asChild={asChild}
			style={
				{
					'--font-default':
						fontStyle === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)',
					'--font-title': 'var(--font-default)',
				} as any
			}
			className={`theme-${primaryColor} font-default`}
		>
			{children}
		</SlotDiv>
	);
}
