import { useHasServerAccess, useSearchParams } from '@biscuits/client';
import { hooks } from '@/hooks.js';
import {
	Box,
	Button,
	clsx,
	Dialog,
	Field,
	Icon,
	ImageUploader,
	Input,
	NumberStepper,
	Text,
	TextArea,
} from '@a-type/ui';

import { graphql, useLazyQuery } from '@biscuits/graphql';

import { typeThemes } from '@wish-wash.biscuits/common';
import {
	Item,
	List,
	ListItemsItemImageFilesDestructured,
} from '@wish-wash.biscuits/verdant';
import { ReactNode, useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { createdItemState } from '../lists/state.js';
import cls from './ItemEditDialog.module.css';
import { ItemNote } from './ItemNote.jsx';

export interface ItemEditDialogProps {
	list: List;
}

export function ItemEditDialog({ list }: ItemEditDialogProps) {
	const [search, setSearch] = useSearchParams();

	const itemId = search.get('itemId');
	const { items } = hooks.useWatch(list);
	hooks.useWatch(items);

	const item = items.find((i) => i.get('id') === itemId);
	hooks.useWatch(item ?? null);

	const justAdded = useSnapshot(createdItemState).justCreatedId === itemId;

	return (
		<Dialog
			open={!!item}
			onOpenChange={(o) => {
				if (!o) {
					setSearch((p) => {
						p.delete('itemId');
						return p;
					});
				}
			}}
		>
			<Dialog.Content
				initialFocus={false}
				className={clsx(`@mode-${typeThemes[item?.get('type') ?? 'idea']}`)}
				width="md"
			>
				<Dialog.Title className="m-0">Edit item</Dialog.Title>
				<Dialog.Description>All fields save automatically</Dialog.Description>
				{item && <ItemTypePicker item={item} />}
				{item && <ItemEditor item={item} />}
				<Dialog.Actions style={{ justifyContent: 'space-between' }}>
					{item && (
						<Button
							emphasis="primary"
							color="attention"
							onClick={() => {
								items.removeAll(item);
								setSearch(
									(p) => {
										p.delete('itemId');
										return p;
									},
									{
										replace: true,
									},
								);
							}}
						>
							<Icon name="trash" />
							{justAdded ? 'Discard' : 'Delete'}
						</Button>
					)}
					<Dialog.Close render={<Button emphasis="primary" />}>
						Done
					</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}

function ItemTypePicker({ item }: { item: Item }) {
	const { type } = hooks.useWatch(item);

	return (
		<Box gap="sm" items="center">
			<Button
				size="small"
				toggled={type === 'idea'}
				onClick={() => item.set('type', 'idea')}
				emphasis="primary"
				className="@mode-lemon"
			>
				<Icon name="lightbulb" /> Idea
			</Button>
			<Button
				size="small"
				toggled={type === 'link'}
				onClick={() => item.set('type', 'link')}
				emphasis="primary"
				className="@mode-leek"
			>
				<Icon name="gift" /> Product
			</Button>
			<Button
				size="small"
				toggled={type === 'vibe'}
				onClick={() => item.set('type', 'vibe')}
				emphasis="primary"
				className="@mode-eggplant"
			>
				<Icon name="magic" /> Vibe
			</Button>
		</Box>
	);
}
function ItemEditor({ item }: { item: Item }) {
	const { type } = hooks.useWatch(item);
	let content: ReactNode = null;
	switch (type) {
		case 'idea':
			content = <IdeaEditor item={item} />;
			break;
		case 'link':
			content = <ProductEditor item={item} />;
			break;
		case 'vibe':
			content = <VibeEditor item={item} />;
			break;
	}

	return (
		<Box col items="stretch" full="width" gap>
			{content}
		</Box>
	);
}

function IdeaEditor({ item }: { item: Item }) {
	return (
		<>
			<ImagesField item={item} />
			<DescriptionField
				item={item}
				placeholder="What kind of thing do you want?"
				autoFocus
			/>
			<ItemNote item={item} />
			<PriceRangeField item={item} />
			<CountField item={item} />
		</>
	);
}

function ProductEditor({ item }: { item: Item }) {
	return (
		<>
			<RemoteImage item={item} />
			<SingleLinkField item={item} autoFocus />
			<DescriptionField item={item} label="What is it?" />
			<ItemNote item={item} />
			<PriceField item={item} />
			<CountField item={item} />
		</>
	);
}

function VibeEditor({ item }: { item: Item }) {
	return (
		<>
			<ImagesField item={item} />
			<DescriptionField item={item} label="What's the vibe?" autoFocus />
			<ItemNote item={item} />
		</>
	);
}

function ImagesField({ item }: { item: Item }) {
	const { imageFiles } = hooks.useWatch(item);
	hooks.useWatch(imageFiles);

	return (
		<Box col full="width" items="stretch" gap="sm">
			<Box
				surface
				overflow="auto-y"
				full="width"
				style={{ maxHeight: 400 }}
				p="sm"
			>
				<div className={cls.images}>
					{imageFiles.map((file) => (
						<ImageField
							key={file.id}
							file={file}
							onRemove={() => {
								imageFiles.removeAll(file);
							}}
						/>
					))}
				</div>
			</Box>
			<Field stretch id="image">
				<Field.Label>Add images</Field.Label>
				<Field.Control
					render={
						<ImageUploader
							className="@mode-neutral"
							value={null}
							onChange={(v) => {
								if (v) {
									imageFiles.push(v);
								}
							}}
							style={{ height: 200, aspectRatio: '16/8' }}
						/>
					}
				/>
			</Field>
		</Box>
	);
}

function ImageField({
	file,
	onRemove,
	className,
}: {
	file: ListItemsItemImageFilesDestructured[number];
	onRemove: () => void;
	className?: string;
}) {
	hooks.useWatch(file);

	return (
		<Box className={className}>
			<img className={cls.imageFieldImage} src={file.url ?? ''} />
			<Button
				emphasis="primary"
				color="attention"
				className={cls.imageFieldClear}
				onClick={onRemove}
			>
				<Icon name="trash" />
			</Button>
		</Box>
	);
}

function DescriptionField({
	item,
	label,
	placeholder,
	autoFocus,
}: {
	item: Item;
	label?: string;
	placeholder?: string;
	autoFocus?: boolean;
}) {
	const descriptionField = hooks.useField(item, 'description');

	return (
		<Field stretch id="description">
			<Field.Label>{label ?? 'Description'}</Field.Label>
			<Field.Control
				render={
					<TextArea
						{...(descriptionField.inputProps as any)}
						autoSelect
						placeholder={placeholder}
						autoFocus={autoFocus}
					/>
				}
			/>
		</Field>
	);
}

function CountField({ item }: { item: Item }) {
	const countField = hooks.useField(item, 'count');

	return (
		<Field stretch id="count">
			<Field.Label>How many do you want?</Field.Label>
			<Field.Control>
				<Box wrap items="center" gap>
					<NumberStepper
						value={countField.value}
						onChange={countField.setValue}
						renderValue={(val) => (val === 0 ? '∞' : val)}
					/>
				</Box>
			</Field.Control>
		</Field>
	);
}

const scanPage = graphql(`
	query ScanStorePage($url: String!) {
		storePageScan(input: { url: $url }) {
			priceString
			productName
			scanner
			imageUrl
			failedReason
		}
	}
`);

function SingleLinkField({
	item,
	autoFocus,
}: {
	item: Item;
	autoFocus?: boolean;
}) {
	const { links } = hooks.useWatch(item);
	hooks.useWatch(links);
	const firstLink = links.get(0) ?? null;

	const subscribed = useHasServerAccess();
	const [doScan, { loading: scanning, data: scanData }] =
		useLazyQuery(scanPage);
	const maybeScanPage = useCallback(async () => {
		if (!subscribed) return;
		if (!firstLink) return;
		if (!URL.canParse(firstLink)) return;
		if (item.get('description') || item.get('priceMin')) return;

		const result = await doScan({
			variables: {
				url: firstLink,
			},
		});
		if (result.data?.storePageScan) {
			const scan = result.data.storePageScan;
			console.log('scan result', scan);
			item.update({
				description: scan.productName ?? undefined,
				priceMin: scan.priceString ?? undefined,
				remoteImageUrl: scan.imageUrl ?? undefined,
			});
		} else {
			console.error('scan failed', result.error);
		}
	}, [firstLink, item, subscribed, doScan]);

	return (
		<Field stretch id="link">
			<Field.Label>Link</Field.Label>
			<Field.Control>
				<Input
					id="link"
					value={links.get(0) || ''}
					type="url"
					onChange={(e) => links.set(0, e.currentTarget.value)}
					onBlur={maybeScanPage}
					autoSelect
					autoFocus={autoFocus}
				/>
				{!!scanning && (
					<Text emphasis="ambient" dim>
						<Icon name="refresh" size={10} /> Scanning page...
					</Text>
				)}
				{!!scanData?.storePageScan?.failedReason && (
					<Text emphasis="ambient" dim color="attention">
						<Icon name="warning" size={10} />{' '}
						{scanData.storePageScan.failedReason}
					</Text>
				)}
			</Field.Control>
		</Field>
	);
}

function PriceRangeField({ item }: { item: Item }) {
	const priceMinField = hooks.useField(item, 'priceMin');
	const priceMaxField = hooks.useField(item, 'priceMax');

	return (
		<Field stretch>
			<Field.Label>Price range</Field.Label>
			<Field.Control>
				<Box items="center" gap>
					<Input
						id="priceMin"
						{...priceMinField.inputProps}
						value={priceMinField.inputProps.value ?? ''}
						placeholder="$10"
						style={{ width: '50%' }}
						aria-label="minimum price"
					/>
					<span>to</span>
					<Input
						id="priceMax"
						{...priceMaxField.inputProps}
						value={priceMaxField.inputProps.value ?? ''}
						placeholder="$100"
						style={{ width: '50%' }}
						aria-label="maximum price"
					/>
				</Box>
			</Field.Control>
		</Field>
	);
}

function PriceField({ item }: { item: Item }) {
	const priceField = hooks.useField(item, 'priceMin');

	return (
		<Field stretch id="price">
			<Field.Label>Price</Field.Label>
			<Field.Control>
				<Input
					id="price"
					{...priceField.inputProps}
					value={priceField.inputProps.value ?? ''}
					placeholder="$10"
				/>
			</Field.Control>
		</Field>
	);
}

function RemoteImage({ item }: { item: Item }) {
	const { remoteImageUrl } = hooks.useWatch(item);

	if (!remoteImageUrl) return null;

	return (
		<img
			src={remoteImageUrl}
			alt="product image"
			className="h-200px object-cover object-center"
		/>
	);
}
