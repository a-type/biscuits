import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	Heading,
	Icon,
	NavBarItem,
	NavBarItemIcon,
	NavBarItemIconWrapper,
	NavBarItemText,
	P,
	withClassName,
} from '@a-type/ui';
import { graphql, useQuery } from '@biscuits/graphql';
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useStorage.js';
import cls from './Changelog.module.css';
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
						<Button emphasis={hasNew ? 'light' : 'ghost'} color="accent">
							<Icon name="gift" />
						</Button>
					)
				}
			/>
			<DialogContent>
				<DialogTitle>What&apos;s new</DialogTitle>
				<Box col gap overflow="auto-y">
					{data.map((item, idx) => (
						<div key={item.id} style={{ position: 'relative' }}>
							<P italic emphasis="ambient">
								{new Date(item.createdAt).toLocaleDateString()}
							</P>
							<Heading render={<h3 />} emphasis="ambient">
								{item.title}
							</Heading>
							{item.imageUrl && (
								<img
									src={item.imageUrl}
									alt={item.title}
									style={{
										height: 'auto',
										width: '100%',
									}}
								/>
							)}
							<P>{item.details}</P>
							{(lastSeenIndex === -1 || idx < lastSeenIndex) && (
								<div className={cls.pip} />
							)}
						</div>
					))}
				</Box>
				<DialogActions>
					<DialogClose />
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}

export function NavBarChangelog() {
	return (
		<ChangelogDisplay hideOnSeen className={cls.desktopOnly}>
			<NavBarChangelogButton>
				<NavBarItemIconWrapper>
					<NavBarItemIcon name="gift" />
				</NavBarItemIconWrapper>
				<NavBarItemText>What&apos;s new</NavBarItemText>
			</NavBarChangelogButton>
		</ChangelogDisplay>
	);
}

const NavBarChangelogButton = withClassName(NavBarItem, cls.changelogItem);
