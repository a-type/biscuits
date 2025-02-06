import { hooks } from '@/hooks.js';
import { Card, cardGridColumns, clsx, Icon, withClassName } from '@a-type/ui';
import { Person } from '@names.biscuits/verdant';
import { ReactNode } from 'react';
import { LocationOffer } from '../location/LocationOffer.jsx';
import { useSuperBar } from './SuperBarContext.jsx';

export interface SuperBarSuggestionsProps {
	className?: string;
}

export function SuperBarSuggestions({ className }: SuperBarSuggestionsProps) {
	const { groups, inputValue } = useSuperBar();

	if (groups.length === 0 || groups.every((g) => g.items.length === 0)) {
		if (!inputValue) {
			return (
				<div className={clsx('p-8 col gap-6', className)}>
					<Icon name="profile" size={80} className="text-gray-5" />
					<div className="text-gray-5 text-center text-lg">
						Add names to get started
					</div>
				</div>
			);
		}

		return (
			<div className={clsx('p-8 col gap-6', className)}>
				<Icon name="profile" size={80} className="text-gray-5" />
				<div className="text-gray-5 text-center text-lg">No matches found</div>
			</div>
		);
	}

	return (
		<div className={clsx('flex flex-col gap-md w-full ', className)}>
			{groups.map((group) => (
				<SuggestionGroup
					key={group.title}
					title={group.title}
					items={group.items}
				/>
			))}
			<LocationOffer />
		</div>
	);
}

function SuggestionGroup({
	title,
	items,
	className,
}: {
	title: string;
	items: Person[];
	className?: string;
}) {
	if (!items.length) {
		return null;
	}
	return (
		<div
			className={clsx(
				'flex flex-col gap-2 repeated:(border-0 border-t border-gray-7 border-solid pt-md)',
				className,
			)}
		>
			<div className="text-xs uppercase text-gray-7 font-bold m2-1">
				{title}
			</div>
			<Card.Grid columns={cardGridColumns.small}>
				{items.map((suggestion, index) => (
					<SuggestionItem key={suggestion.get('id')} value={suggestion} />
				))}
			</Card.Grid>
		</div>
	);
}

function SuggestionItem({
	className,
	value,
	...rest
}: {
	highlighted?: boolean;
	className?: string;
	value: Person;
}) {
	const { name, note, photo } = hooks.useWatch(value);
	hooks.useWatch(photo);
	const { inputValue, selectPerson } = useSuperBar();

	return (
		<Card {...rest}>
			<Card.Main
				className={clsx('min-h-0', photo?.url && 'min-h-100px')}
				compact
				onClick={() => selectPerson(value)}
			>
				{photo?.url && (
					<Card.Image
						className="bg-cover [background-position:center_20%]"
						style={{ backgroundImage: `url(${photo.url})` }}
					/>
				)}
				<CardTitle>{name}</CardTitle>
				{note && (
					<NoteMatch
						overlay={!!photo?.url}
						note={note}
						inputValue={inputValue}
					/>
				)}
			</Card.Main>
		</Card>
	);
}

function NoteMatch({
	note,
	inputValue,
	overlay,
}: {
	note: string;
	inputValue: string;
	overlay?: boolean;
}) {
	const noteMatchIndex =
		inputValue ? note.toLowerCase().indexOf(inputValue.toLowerCase()) : -1;
	let content: ReactNode = note;

	if (noteMatchIndex !== -1) {
		content = [
			noteMatchIndex - 10 > 0 ? '...' : '',
			note.slice(Math.max(0, noteMatchIndex - 10), noteMatchIndex),
			<span key="match" className="font-bold">
				{note.slice(noteMatchIndex, noteMatchIndex + inputValue.length)}
			</span>,
			note.slice(
				noteMatchIndex + inputValue.length,
				Math.min(note.length, noteMatchIndex + 10),
			) + '...',
		];
	}
	return (
		<InlineCardContent unstyled={!overlay}>
			<Icon name="note" />{' '}
			<span className="text-ellipsis overflow-hidden min-w-0 flex-1">
				{content}
			</span>
		</InlineCardContent>
	);
}

const CardTitle = withClassName(
	Card.Title,
	'flex-row items-center gap-sm w-full rounded-none text-sm relative z-1',
	'[:hover>&]:bg-gray-2',
);

const InlineCardContent = withClassName(
	Card.Content,
	'flex-row items-center text-nowrap text-ellipsis overflow-hidden gap-xs px-2 py-1 relative z-1 flex min-w-0 self-stretch',
);
