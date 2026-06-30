import { LinkButton } from '@/components/nav/Link.jsx';
import { Box, Icon, PageFixedArea } from '@a-type/ui';
import { ReactNode } from 'react';

export interface HeaderBarProps {
	children?: ReactNode;
	backUrl: string;
	className?: string;
}

export function HeaderBar({ children, backUrl, className }: HeaderBarProps) {
	return (
		<PageFixedArea
			style={{
				top: 0,
				zIndex: 10,
			}}
			className={className}
		>
			<Box items="center" gap="sm" p="xs">
				<LinkButton to={backUrl} emphasis="ghost">
					<Icon name="arrowLeft" />
					Back
				</LinkButton>
				{children}
			</Box>
		</PageFixedArea>
	);
}
