import { hooks } from '@/hooks.js';
import {
	Box,
	Button,
	Card,
	cardGridColumns,
	clsx,
	Icon,
	Text,
	withClassName,
} from '@a-type/ui';
import { Person, PersonGeolocation } from '@names.biscuits/verdant';
import { ReactNode, Suspense } from 'react';
import { LocationOffer } from '../location/LocationOffer.jsx';
import { TagDisplay } from '../tags/TagDisplay.jsx';
import { useSuperBar } from './SuperBarContext.jsx';
import cls from './SuperBarSuggestions.module.css';
import { SuperBarTagFilter } from './SuperBarTagFilter.jsx';

export interface SuperBarSuggestionsProps {
	className?: string;
}

export function SuperBarSuggestions({ className }: SuperBarSuggestionsProps) {
	const { groups, inputValue, tagFilter } = useSuperBar();

	if (
		groups.length === 0 ||
		(groups.every((g) => g.items.length === 0) && tagFilter.length === 0)
	) {
		if (!inputValue) {
			return (
				<Box
					col
					gap="md"
					p="lg"
					items="center"
					dim
					className={clsx('@mode-loose', className)}
				>
					<Icon name="profile" size={80} />
					<Text dim>Add names to get started</Text>
				</Box>
			);
		}

		return (
			<Box
				col
				gap="md"
				p="lg"
				items="center"
				dim
				className={clsx('@mode-loose', className)}
			>
				<Icon name="profile" size={80} />
				<Text dim>No matches found</Text>
			</Box>
		);
	}

	return (
		<Box full="width" gap col className={className}>
			{groups.map((group) => (
				<SuggestionGroup
					key={group.title}
					title={group.title}
					items={group.items}
				/>
			))}
			<Suspense>
				<LocationOffer />
			</Suspense>
		</Box>
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
	const { loadMoreRecents, tagFilter } = useSuperBar();
	const isRecents = title === 'Recent people';
	if (!items.length && (!isRecents || tagFilter.length === 0)) {
		return null;
	}
	return (
		<div className={clsx(cls.suggestionGroup, className)}>
			<Text emphasis="ambient" bold uppercase dim className={cls.title}>
				{title}
			</Text>
			{isRecents && <SuperBarTagFilter />}
			<Card.Grid columns={cardGridColumns.small}>
				{items.map((suggestion) => (
					<SuggestionItem key={suggestion.get('id')} value={suggestion} />
				))}
			</Card.Grid>
			{isRecents && loadMoreRecents && (
				<Button
					emphasis="ghost"
					onClick={loadMoreRecents}
					className={cls.loadMore}
				>
					Load more
					<Icon name="arrowDown" />
				</Button>
			)}
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
	const { name, note, photo, tags, geolocation } = hooks.useWatch(value);
	hooks.useWatch(photo);
	const { inputValue, selectPerson } = useSuperBar();

	return (
		<Box col items="start" {...rest}>
			<Card
				className={clsx(
					cls.card,
					note || tags.length || (photo?.url && cls.cardFull),
				)}
			>
				<Card.Main
					style={{ minHeight: photo?.url ? '100px' : 0 }}
					className={cls.cardMain}
					onClick={() => selectPerson(value)}
				>
					{photo?.url && (
						<Card.Image
							className={cls.cardImage}
							style={{ backgroundImage: `url(${photo.url})` }}
						/>
					)}
					<Card.Title>{name}</Card.Title>
					{!!tags.length && (
						<Card.Content unstyled className={cls.cardTags}>
							{tags.map((tag) => (
								<Suspense key={tag}>
									<TagDisplay name={tag} />
								</Suspense>
							))}
						</Card.Content>
					)}
					{note && (
						<NoteMatch
							overlay={!!photo?.url}
							note={note}
							inputValue={inputValue}
						/>
					)}
					{geolocation && (
						<GeolocationMatch
							overlay={!!photo?.url}
							geolocation={geolocation}
							inputValue={inputValue}
						/>
					)}
				</Card.Main>
			</Card>
		</Box>
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
			<Text bold key="match">
				{note.slice(noteMatchIndex, noteMatchIndex + inputValue.length)}
			</Text>,
			note.slice(
				noteMatchIndex + inputValue.length,
				Math.min(note.length, noteMatchIndex + 10),
			) + '...',
		];
	}
	return (
		<InlineCardContent unstyled={!overlay}>
			<Icon name="note" /> <span className={cls.note}>{content}</span>
		</InlineCardContent>
	);
}

function GeolocationMatch({
	geolocation,
	inputValue,
	overlay,
}: {
	geolocation: PersonGeolocation;
	inputValue: string;
	overlay?: boolean;
}) {
	const { label } = hooks.useWatch(geolocation);
	const locationMatchIndex =
		inputValue && label ?
			label.toLowerCase().indexOf(inputValue.toLowerCase())
		:	-1;

	if (!label) return null;

	let content: ReactNode = label;

	if (locationMatchIndex !== -1) {
		content = [
			locationMatchIndex - 10 > 0 ? '...' : '',
			label.slice(Math.max(0, locationMatchIndex - 10), locationMatchIndex),
			<Text bold key="match">
				{label.slice(
					locationMatchIndex,
					locationMatchIndex + inputValue.length,
				)}
			</Text>,
			label.slice(
				locationMatchIndex + inputValue.length,
				Math.min(label.length, locationMatchIndex + 10),
			) + '...',
		];
	}
	return (
		<InlineCardContent unstyled={!overlay}>
			<Icon name="location" /> <span className={cls.note}>{content}</span>
		</InlineCardContent>
	);
}

const InlineCardContent = withClassName(Card.Content, cls.inlineCardContent);
