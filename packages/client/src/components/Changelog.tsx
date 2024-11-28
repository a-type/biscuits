import {
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	Icon,
	NavBarItem,
	NavBarItemIcon,
	NavBarItemIconWrapper,
	NavBarItemText,
	withClassName,
} from '@a-type/ui';
import { graphql, useQuery } from '@biscuits/graphql';
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useStorage.js';
import { useAppId } from './Context.js';

export interface ChangelogDisplayProps {
	children?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	hideOnSeen?: boolean;
	className?: string;
}

const changelogQuery = graphql(`
	query ChangelogMain($appId: String!) {
		changelog(appId: $appId) {
			id
			title
			details
			createdAt
			imageUrl
			important
		}
	}
`);

export function ChangelogDisplay({
	children,
	hideOnSeen,
	className,
	...rest
}: ChangelogDisplayProps) {
	const [seen, setSeen] = useLocalStorage<string | null>(
		'changelog-seen',
		null,
	);
	const [capturedSeen] = useState(seen);
	const appId = useAppId();
	const res = useQuery(changelogQuery, { variables: { appId } });
	const data = res.data?.changelog || [];
	const lastSeenIndex = data.findIndex((x) => x.id === capturedSeen);
	const hasUnseen = !!data.length && lastSeenIndex !== 0;
	const hasNew = !!data.length && data.findIndex((x) => x.id === seen) !== 0;

	if (!hasUnseen && hideOnSeen) return null;

	return (
		<Dialog
			{...rest}
			onOpenChange={(open) => {
				rest.onOpenChange?.(open);
				if (open && data[0]) {
					setSeen(data[0].id.toString());
				}
			}}
		>
			<DialogTrigger asChild className={className} data-new={hasNew}>
				{children || (
					<Button
						color="ghost"
						className={hasNew ? 'color-accent-dark bg-accent-wash' : undefined}
						size="icon"
					>
						<Icon name="gift" />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>What&apos;s new</DialogTitle>
				<div className="flex flex-col overflow-y-auto gap-4">
					{data.map((item, idx) => (
						<div key={item.id} className="relative">
							<p className="text-xs italic text-gray-7 mb-1">
								{new Date(item.createdAt).toLocaleDateString()}
							</p>
							<h3 className="text-lg font-bold mt-0 mb-2">{item.title}</h3>
							{item.imageUrl && (
								<img
									src={item.imageUrl}
									alt={item.title}
									className="w-full h-auto"
								/>
							)}
							<p className="text-sm mt-0">{item.details}</p>
							{(lastSeenIndex === -1 || idx < lastSeenIndex) && (
								<div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full" />
							)}
						</div>
					))}
				</div>
				<DialogActions>
					<DialogClose asChild>
						<Button>Close</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}

export function NavBarChangelog() {
	return (
		<ChangelogDisplay hideOnSeen className="hidden md:flex">
			<NavBarChangelogButton>
				<NavBarItemIconWrapper>
					<NavBarItemIcon name="gift" />
				</NavBarItemIconWrapper>
				<NavBarItemText>What&apos;s new</NavBarItemText>
			</NavBarChangelogButton>
		</ChangelogDisplay>
	);
}

const NavBarChangelogButton = withClassName(
	NavBarItem,
	'[&[data-new=true]]:(bg-accent-wash text-accent-dark)',
);
