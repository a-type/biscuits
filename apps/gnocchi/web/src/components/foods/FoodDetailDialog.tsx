import { FoodName } from '@/components/foods/FoodName.jsx';
import { FoodNamesEditor } from '@/components/foods/FoodNamesEditor.jsx';
import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { useExpiresText } from '@/components/pantry/hooks.js';
import { hooks } from '@/stores/groceries/index.js';
import { useChangeFoodCanonicalName } from '@/stores/groceries/mutations.js';
import {
	Box,
	Button,
	Dialog,
	DialogTitle,
	Divider,
	Field,
	H3,
	Icon,
	Input,
	RelativeTime,
	Switch,
	Text,
	TextSkeleton,
	Tooltip,
	withProps,
} from '@a-type/ui';
import { Food } from '@gnocchi.biscuits/verdant';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { CategorySelect } from '../groceries/categories/CategorySelect.jsx';

export interface FoodDetailDialogProps {}

export function FoodDetailDialog({}: FoodDetailDialogProps) {
	const navigate = useNavigate();
	const { showFood: foodName } = useSearch({ strict: false });
	const open = !!foodName;
	const onClose = () => {
		navigate({
			search: (prev) =>
				({
					...prev,
					showFood: undefined,
				} as never),
			viewTransition: false,
		});
	};
	return (
		<Suspense>
			<Dialog open={open} onOpenChange={onClose}>
				<Dialog.Content initialFocus={false}>
					<Suspense fallback={<SkeletonDetails />}>
						{foodName && <FoodDetailView foodName={foodName} open={open} />}
					</Suspense>
					<Dialog.Actions>
						<Dialog.Close />
					</Dialog.Actions>
				</Dialog.Content>
			</Dialog>
		</Suspense>
	);
}

function FoodDetailView({
	foodName,
	open,
}: {
	foodName: string;
	open: boolean;
}) {
	const client = hooks.useClient();
	const food = hooks.useOneFood({
		index: {
			where: 'anyName',
			equals: foodName,
		},
		skip: !open,
	});
	hooks.useWatch(food);

	const [justDeleted, setJustDeleted] = useState(false);
	const expiresText = useExpiresText(food);

	if (!food)
		return (
			<Box col items="center" gap>
				<div>No food data for &quot;{foodName}&quot;</div>
				{justDeleted && (
					<Button emphasis="ghost" onClick={() => client.undoHistory.undo()}>
						Undo delete
					</Button>
				)}
			</Box>
		);

	const lastPurchasedAt = food.get('lastPurchasedAt');
	const frozenAt = food.get('frozenAt');
	const purchaseIntervalDays = food.get('purchaseIntervalGuess')
		? Math.round(
				Math.max(
					1,
					(food.get('purchaseIntervalGuess') ?? 0) / (1000 * 60 * 60 * 24),
				),
		  )
		: 0;

	return (
		<Box col gap="lg">
			<DialogTitle>
				<FoodNameEditor food={food} />
			</DialogTitle>
			{lastPurchasedAt || expiresText || purchaseIntervalDays ? (
				<Box col gap="sm">
					{!!lastPurchasedAt && (
						<Row>
							<Icon name="clock" />
							<Text emphasis="ambient" italic>
								Added <RelativeTime value={lastPurchasedAt} />
							</Text>
						</Row>
					)}
					{!!frozenAt && (
						<Row style={{ color: 'var(--m-accent-heavy)' }}>
							<Icon name="snowflake" />
							<Text emphasis="ambient" italic>
								Frozen <RelativeTime value={frozenAt} />
							</Text>
						</Row>
					)}
					{!!expiresText && (
						<Row>
							<Icon name="warning" />
							<Text emphasis="ambient" italic>
								{expiresText}
							</Text>
						</Row>
					)}
					{!!purchaseIntervalDays && (
						<Row>
							<Icon name="refresh" />
							<Text emphasis="ambient" italic>
								You buy this about every {purchaseIntervalDays} day
								{purchaseIntervalDays === 1 ? '' : 's'}
							</Text>
						</Row>
					)}
				</Box>
			) : null}
			<Field id="categoryId">
				<Field.Label>Category:</Field.Label>
				<Field.Control
					render={
						<CategorySelect
							value={food.get('categoryId')}
							onChange={(val) => food.set('categoryId', val)}
							className="@mode-dense"
						/>
					}
				/>
			</Field>
			<Field id="defaultListId">
				<Field.Label>Default list:</Field.Label>
				<Field.Control
					render={
						<ListSelect
							value={food.get('defaultListId')}
							onChange={(val) => food.set('defaultListId', val)}
							includeAll={false}
						/>
					}
				/>
			</Field>
			<Divider />
			<Field>
				<Field.Label htmlFor="expiresAfterDays">Expires after</Field.Label>
				<Field.Control
					render={
						<Input.Border>
							<Input.Input
								id="expiresAfterDays"
								type="number"
								max={9999}
								min={0}
								value={food.get('expiresAfterDays')?.toString() ?? ''}
								onValueChange={(val) => {
									if (val === '') {
										food.set('expiresAfterDays', null);
										food.set('expiresAt', null);
										return;
									} else {
										const v = parseInt(val);
										if (isNaN(v)) return;
										food.set('expiresAfterDays', v);
										const lastPurchasedAt = food.get('lastPurchasedAt');
										if (lastPurchasedAt) {
											food.set(
												'expiresAt',
												lastPurchasedAt + v * 1000 * 60 * 60 * 24,
											);
										}
									}
								}}
							/>
							<span>days</span>
						</Input.Border>
					}
				/>
				<Field.Description>
					Set this and the app will remind you when something is about to
					expire.
				</Field.Description>
			</Field>
			<Box col gap="sm" p="none">
				<Field horizontal>
					<Field.Control>
						<Switch
							checked={food.get('isStaple')}
							onCheckedChange={(val) => food.set('isStaple', val === true)}
							id="isStaple"
						/>
					</Field.Control>
					<Field.Label htmlFor="isStaple">Staple food</Field.Label>
				</Field>
				<Field.Description>
					Staples are automatically added to the list when they run out
				</Field.Description>
			</Box>
			<Divider />
			<H3>Alternate names</H3>
			<FoodNamesEditor names={food.get('alternateNames')} />
			<Field horizontal>
				<Field.Control>
					<Switch
						checked={food.get('pluralizeName')}
						onCheckedChange={(val) => food.set('pluralizeName', val === true)}
						id="pluralizeName"
					/>
				</Field.Control>
				<Field.Label htmlFor="pluralizeName">Use pluralized name</Field.Label>
			</Field>
			<Divider />
			<Field horizontal>
				<Field.Control>
					<Switch
						checked={food.get('doNotSuggest')}
						onCheckedChange={(val) => food.set('doNotSuggest', val === true)}
						id="doNotSuggest"
						className="@mode-attention"
					/>
				</Field.Control>
				<Field.Label htmlFor="doNotSuggest">Do not suggest</Field.Label>
			</Field>
			<Row>
				<Button
					onClick={() => {
						client.foods.delete(food.get('canonicalName'));
						setJustDeleted(true);
					}}
					emphasis="primary"
					color="attention"
				>
					Delete
				</Button>
			</Row>
		</Box>
	);
}

function SkeletonDetails() {
	return (
		<Box col gap full="width">
			<Dialog.Title>
				<TextSkeleton maxLength={20} aria-label="Loading" />
			</Dialog.Title>
			<Box col gap>
				<TextSkeleton maxLength={15} />
				<TextSkeleton maxLength={25} />
				<TextSkeleton maxLength={25} />
			</Box>
			<Divider />
			<Box col gap>
				<TextSkeleton maxLength={20} />
				<TextSkeleton maxLength={30} />
				<TextSkeleton maxLength={30} />
			</Box>
			<Divider />
			<Box col gap>
				<TextSkeleton maxLength={15} />
				<TextSkeleton maxLength={25} />
				<TextSkeleton maxLength={25} />
			</Box>
			<Divider />
			<Box col gap>
				<TextSkeleton maxLength={15} />
				<TextSkeleton maxLength={25} />
			</Box>
			<Box col gap>
				<TextSkeleton maxLength={15} />
				<TextSkeleton maxLength={25} />
			</Box>
		</Box>
	);
}

const Row = withProps(Box, { gap: true, items: 'center' });

const FoodNameEditor = ({ food }: { food: Food }) => {
	const changeName = useChangeFoodCanonicalName();
	const [newName, setNewName] = useState(food.get('canonicalName'));
	const [editing, setEditing] = useState(false);

	if (editing) {
		return (
			<Box gap="sm">
				<Input.Border>
					<Input.Input
						value={newName}
						onChange={(ev) => setNewName(ev.target.value ?? '')}
						placeholder={food.get('canonicalName')}
						autoSelect
						autoFocus
					/>
					<Button
						size="small"
						emphasis="ghost"
						onClick={() => setEditing(false)}
					>
						<Icon name="x" />
					</Button>
				</Input.Border>
				{newName !== food.get('canonicalName') && (
					<Suspense
						fallback={
							<Button disabled emphasis="primary">
								<Icon name="check" />
								<span>Rename</span>
							</Button>
						}
					>
						<FoodNameEditorSaveButton
							onSave={() => {
								changeName(food, newName);
								setEditing(false);
							}}
							newName={newName}
							food={food}
						/>
					</Suspense>
				)}
			</Box>
		);
	}
	return (
		<Box gap="sm">
			<FoodName food={food} capitalize />
			<Tooltip content="Rename or merge">
				<Button
					emphasis="ghost"
					onClick={() => setEditing(true)}
					style={{ position: 'relative', top: -1 }}
				>
					<Icon name="pencil" />
				</Button>
			</Tooltip>
		</Box>
	);
};

function FoodNameEditorSaveButton({
	onSave,
	newName,
	food,
}: {
	onSave: () => void;
	newName: string;
	food: Food;
}) {
	const foodToMerge = hooks.useOneFood({
		index: {
			where: 'anyName',
			equals: newName,
		},
	});
	const merge = !!foodToMerge && foodToMerge !== food;
	return (
		<Button emphasis="primary" onClick={onSave}>
			<Icon name={!!merge ? 'convert' : 'check'} />
			<span>{!!merge ? 'Merge' : 'Rename'}</span>
		</Button>
	);
}
