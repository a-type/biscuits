import { LinkButton } from '@/components/nav/Link.jsx';
import { Box, Icon, PageFixedArea } from '@a-type/ui';
import { LinkButtonProps } from '@biscuits/client';
import { ReactNode } from 'react';

export interface HeaderBarProps {
	children?: ReactNode;
	className?: string;
}

export function HeaderBar({ children, className }: HeaderBarProps) {
	return (
		<PageFixedArea
			style={{
				top: 0,
				zIndex: 10,
			}}
			className={className}
		>
			<Box items="center" gap="sm" p="xs">
				{children}
			</Box>
		</PageFixedArea>
	);
}

export function HeaderBarBack(props: LinkButtonProps) {
	return (
		<LinkButton to="/recipes" {...props} emphasis="ghost">
			<Icon name="arrowLeft" />
			Back
		</LinkButton>
	);
}
