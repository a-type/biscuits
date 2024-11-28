import { LinkButton } from '@/components/nav/Link.jsx';
import { PageFixedArea } from '@a-type/ui';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
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
			<LinkButton to={backUrl} color="ghost">
				<ArrowLeftIcon />
				Back
			</LinkButton>
			{children}
		</PageFixedArea>
	);
}
