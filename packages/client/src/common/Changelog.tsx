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
	children?: React.ReactElement;
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
			<DialogTrigger
				className={className}
				data-new={hasNew}
				render={() =>
					children || (
						<Button
							emphasis="ghost"
							className={
								hasNew ? 'color-accent-dark bg-accent-wash' : undefined
							}
						>
							<Icon name="gift" />
						</Button>
					)
				}
			/>
			<DialogContent>
				<DialogTitle>What&apos;s new</DialogTitle>
				<div className="flex flex-col gap-4 overflow-y-auto">
					{data.map((item, idx) => (
						<div key={item.id} className="relative">
							<p className="mb-1 text-xs italic color-gray-dark">
								{new Date(item.createdAt).toLocaleDateString()}
							</p>
							<h3 className="mb-2 mt-0 text-lg font-bold">{item.title}</h3>
							{item.imageUrl && (
								<img
									src={item.imageUrl}
									alt={item.title}
									className="h-auto w-full"
								/>
							)}
							<p className="mt-0 text-sm">{item.details}</p>
							{(lastSeenIndex === -1 || idx < lastSeenIndex) && (
								<div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-accent" />
							)}
						</div>
					))}
				</div>
				<DialogActions>
					<DialogClose />
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
	'[&[data-new=true]]:(bg-accent-wash color-accent-dark)',
);
