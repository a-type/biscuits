import { hooks } from '@/hooks.js';
import { SlotDiv } from '@a-type/ui';
import { ReactNode } from 'react';

export function Themed({
	notebookId,
	children,
	asChild,
	includeSpacing,
}: {
	notebookId: string;
	children?: ReactNode;
	asChild?: boolean;
	includeSpacing?: boolean;
}) {
	const notebook = hooks.useNotebook(notebookId);
	hooks.useWatch(notebook);
	const theme = notebook?.get('theme') ?? null;
	hooks.useWatch(theme);
	const { primaryColor, fontStyle, corners, spacing } = theme?.getAll() ?? {
		spacing: 'md',
		primaryColor: 'blueberry',
		fontStyle: 'sans-serif',
	};
	if (!notebook) return <SlotDiv asChild={asChild}>{children}</SlotDiv>;

	const style = {
		'--font-default':
			fontStyle === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)',
		'--font-title': 'var(--font-default)',
		'--global-corner-scale': corners === 'rounded' ? '1' : '0.25',
	} as any;
	if (includeSpacing) {
		style['--global-spacing-scale'] =
			spacing === 'sm' ? '0.5'
			: spacing === 'lg' ? '2'
			: '1';
	}

	return (
		<SlotDiv
			asChild={asChild}
			style={style}
			className={`theme-${primaryColor} font-default`}
		>
			{children}
		</SlotDiv>
	);
}
