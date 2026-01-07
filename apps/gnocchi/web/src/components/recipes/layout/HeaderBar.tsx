import { LinkButton } from '@/components/nav/Link.jsx';
import { Icon, PageFixedArea } from '@a-type/ui';
import classNames from 'classnames';
import { ReactNode } from 'react';

export interface HeaderBarProps {
	children?: ReactNode;
	backUrl: string;
	className?: string;
}

export function HeaderBar({ children, backUrl, className }: HeaderBarProps) {
	return (
		<PageFixedArea
			className={classNames(
				'z-10 top-0 flex flex-row items-center gap-3 py-1',
				className,
			)}
		>
			<LinkButton to={backUrl} emphasis="ghost">
				<Icon name="arrowLeft" />
				Back
			</LinkButton>
			{children}
		</PageFixedArea>
	);
}
