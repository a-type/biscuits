import { hooks } from '@/hooks.js';
import {
	Box,
	Card,
	CardContent,
	CardGrid,
	cardGridColumns,
	CardMain,
	CardTitle,
	clsx,
	Dialog,
	H2,
	Icon,
	IconName,
	P,
} from '@a-type/ui';
import {
	OnboardingQuestion,
	onboardingQuestions,
	WishlistOnboarding,
} from '@wish-wash.biscuits/common';
import { List } from '@wish-wash.biscuits/verdant';
import {
	CSSProperties,
	ReactNode,
	Suspense,
	useCallback,
	useState,
} from 'react';
import { ItemEditDialog } from '../items/ItemEditDialog.jsx';
import { ListItem } from '../items/ListItem.jsx';
import { ItemSorter } from './ItemSorter.jsx';
import { AddBar } from './add/AddBar.jsx';

export interface ListViewProps {
	list: List;
	className?: string;
	style?: CSSProperties;
}

function useListOnboardingProps(list: List, onDone?: () => void) {
	const { items, completedQuestions } = hooks.useWatch(list);
	hooks.useWatch(completedQuestions);
	const onAnswers = useCallback(
		(answers: Map<OnboardingQuestion, string>) => {
			for (const [question, answer] of answers) {
				console.log(question, answer);
				if (answer) {
					items.push({
						description: answer,
						prompt: question.prompt,
						type: 'idea',
					});
				}
				completedQuestions.push(question.id);
			}
			onDone?.();
		},
		[items, completedQuestions, onDone],
	);
	return {
		answeredQuestions: completedQuestions.getSnapshot(),
		onAnswers,
	};
}

export function ListView({ list, className, style }: ListViewProps) {
	const { items, type, completedQuestions } = hooks.useWatch(list);
	hooks.useWatch(items);
	hooks.useWatch(completedQuestions);

	const needsOnboarding =
		type === 'wishlist' && completedQuestions.length === 0;
	const onboardingProps = useListOnboardingProps(list);

	if (needsOnboarding) {
		return (
			<Box col items="stretch" gap style={style}>
				<Box
					surface="secondary"
					full="width"
					style={{
						marginInline: 'auto',
						maxWidth: '800px',
					}}
				>
					<H2>Welcome to your wishlist!</H2>
					<P>Let's get your wish list started with some ideas.</P>
					<WishlistOnboarding
						{...onboardingProps}
						thanksText="That'll get your list started. Now add more ideas!"
					/>
				</Box>
			</Box>
		);
	}

	return (
		<Box col gap items="stretch" className={className} style={style}>
			<AddBar list={list} />
			<Box items="stretch" gap full="width">
				<Box grow>
					<CardGrid
						columns={cardGridColumns.small}
						style={{ zIndex: 0, flex: 1, width: '100%' }}
					>
						{items.map((item) => (
							<ListItem item={item} key={item.get('id')} />
						))}
						{items.length === 0 && <TutorialCards />}
						{items.length > 0 && <KeepAnsweringQuestionsCard list={list} />}
					</CardGrid>
				</Box>
				<ItemSorter list={list} />
			</Box>
			<Suspense>
				<ItemEditDialog list={list} />
			</Suspense>
		</Box>
	);
}

function TutorialCards() {
	return (
		<>
			<Card>
				<CardMain>
					<CardTitle>Add items to your list</CardTitle>
					<CardContent>
						Use the buttons above to add your first item. Wish Wash has several
						types of items...
					</CardContent>
				</CardMain>
			</Card>
			<TutorialCard theme="lemon" title="Ideas" icon="lightbulb">
				Ideas are things you know you want, but don't have a particular example
				for. Like, "a black dress" or "a phone case"&mdash;maybe you don't care
				which one, or just don't know yet.
			</TutorialCard>
			<TutorialCard theme="eggplant" title="Vibes" icon="magic">
				Vibes help to describe your aesthetic&mdash;just the general feeling or
				style of things you like. Vibes help others find creative and
				spontaneous gifts.
			</TutorialCard>
			<TutorialCard theme="leek" title="Links" icon="gift">
				Links are specific things, with a link to a store page to buy it. That's
				not what Wish Wash is all about, but you can still add them.
			</TutorialCard>
		</>
	);
}

function TutorialCard({
	title,
	children,
	theme,
	icon,
}: {
	theme: string;
	title: string;
	children: ReactNode;
	icon: IconName;
}) {
	return (
		<Card className={clsx(`@mode-${theme}`, 'color-main-dark bg-main-wash')}>
			<Card.Main>
				<Card.Title>
					<Icon size={30} name={icon} />
					{title}
				</Card.Title>
				<Card.Content unstyled>
					<Box p>{children}</Box>
				</Card.Content>
			</Card.Main>
		</Card>
	);
}

function KeepAnsweringQuestionsCard({ list }: { list: List }) {
	const { completedQuestions } = hooks.useWatch(list);
	const totalQuestions = onboardingQuestions.length;
	const [open, setOpen] = useState(false);
	const onDone = useCallback(() => setOpen(false), []);
	const onboardingProps = useListOnboardingProps(list, onDone);

	if (completedQuestions.length >= totalQuestions) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Card>
				<Dialog.Trigger render={<Card.Main />}>
					<Card.Content>Improve your list with more ideas</Card.Content>
				</Dialog.Trigger>
			</Card>
			<Dialog.Content>
				<WishlistOnboarding
					{...onboardingProps}
					thanksText="Nice, all done for now."
				/>
			</Dialog.Content>
		</Dialog>
	);
}
