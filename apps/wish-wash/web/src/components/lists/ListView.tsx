import { hooks } from '@/hooks.js';
import {
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
import { ReactNode, Suspense, useCallback, useState } from 'react';
import { ItemEditDialog } from '../items/ItemEditDialog.jsx';
import { ListItem } from '../items/ListItem.jsx';
import { ItemSorter } from './ItemSorter.jsx';
import { AddBar } from './add/AddBar.jsx';

export interface ListViewProps {
	list: List;
	className?: string;
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

export function ListView({ list, className }: ListViewProps) {
	const { items, type, completedQuestions } = hooks.useWatch(list);
	hooks.useWatch(items);
	hooks.useWatch(completedQuestions);

	const needsOnboarding =
		type === 'wishlist' && completedQuestions.length === 0;
	const onboardingProps = useListOnboardingProps(list);

	if (needsOnboarding) {
		return (
			<div className="flex flex-col items-stretch gap-4">
				<div className="mx-auto bg-primary-wash p-4 rounded-lg max-w-800px w-full">
					<H2>Welcome to your wishlist!</H2>
					<P>Let's get your wish list started with some ideas.</P>
					<WishlistOnboarding
						{...onboardingProps}
						thanksText="That'll get your list started. Now add more ideas!"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className={clsx('col items-stretch gap-4', className)}>
			<AddBar
				list={list}
				className="fixed bottom-sm left-1/2 center-x z-now-playing"
			/>
			<div className="row items-stretch">
				<div className="flex-1">
					<CardGrid columns={cardGridColumns.small} className="flex-1 z-0">
						{items.map((item) => (
							<ListItem item={item} key={item.get('id')} />
						))}
						{items.length === 0 && <TutorialCards />}
						{items.length > 0 && <KeepAnsweringQuestionsCard list={list} />}
					</CardGrid>
				</div>
				<ItemSorter list={list} />
			</div>
			<Suspense>
				<ItemEditDialog list={list} />
			</Suspense>
		</div>
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
		<Card
			className={clsx(`theme-${theme}`, 'bg-primary-wash color-primary-dark')}
		>
			<CardMain>
				<CardContent
					unstyled
					className="flex flex-row items-center gap-3 p-3 font-bold text-lg"
				>
					<Icon className="w-[30px] h-[30px] [stroke-width:0.3]" name={icon} />
					{title}
				</CardContent>
				<CardContent unstyled className="p-2">
					{children}
				</CardContent>
			</CardMain>
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
				<Dialog.Trigger asChild>
					<Card.Main>
						<Card.Content unstyled className="p-sm text-sm">
							Improve your list with more ideas
						</Card.Content>
					</Card.Main>
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
