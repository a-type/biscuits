import { FoodName } from '@/components/foods/FoodName.jsx';
import { FoodNamesEditor } from '@/components/foods/FoodNamesEditor.jsx';
import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { useExpiresText } from '@/components/pantry/hooks.js';
import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	Divider,
	H3,
	Icon,
	Input,
	LiveUpdateTextField,
	RelativeTime,
	Tooltip,
	withClassName,
} from '@a-type/ui';
import { preventDefault } from '@a-type/utils';
import { Food } from '@gnocchi.biscuits/verdant';
import {
	ClockIcon,
	ExclamationTriangleIcon,
	ReloadIcon,
} from '@radix-ui/react-icons';
import { useSearchParams } from '@verdant-web/react-router';
import { Suspense, useState } from 'react';
import { CategorySelect } from '../groceries/categories/CategorySelect.jsx';

export interface FoodDetailDialogProps {}

export function FoodDetailDialog({}: FoodDetailDialogProps) {
	const [params, setParams] = useSearchParams();
	const foodName = params.get('showFood');
	const open = !!foodName;
	const onClose = () => {
		setParams(
			(old) => {
				old.delete('showFood');
				return old;
			},
			{ state: { noUpdate: true } },
		);
	};
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent onOpenAutoFocus={preventDefault}>
				<Suspense>
					{foodName && <FoodDetailView foodName={foodName} open={open} />}
				</Suspense>
				<DialogActions>
					<DialogClose asChild>
						<Button>Close</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
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
			<div className="flex flex-col items-center gap-4">
				<div>No food data for &quot;{foodName}&quot;</div>
				{justDeleted && (
					<Button color="ghost" onClick={() => client.undoHistory.undo()}>
						Undo delete
					</Button>
				)}
			</div>
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
		<div className="flex flex-col gap-3">
			<DialogTitle>
				<FoodNameEditor food={food} />
			</DialogTitle>
			{lastPurchasedAt || expiresText || purchaseIntervalDays ? (
				<div className="flex flex-col gap-2">
					{!!lastPurchasedAt && (
						<Row>
							<ClockIcon />
							<div className="text-xs italic">
								Added <RelativeTime value={lastPurchasedAt} />
							</div>
						</Row>
					)}
					{!!frozenAt && (
						<Row className="text-accent-dark">
							<Icon name="snowflake" />
							<div className="text-xs italic">
								Frozen <RelativeTime value={frozenAt} />
							</div>
						</Row>
					)}
					{!!expiresText && (
						<Row>
							<ExclamationTriangleIcon />
							<div className="text-xs italic">{expiresText}</div>
						</Row>
					)}
					{!!purchaseIntervalDays && (
						<Row>
							<ReloadIcon />
							<div className="text-xs italic">
								You buy this about every {purchaseIntervalDays} day
								{purchaseIntervalDays === 1 ? '' : 's'}
							</div>
						</Row>
					)}
				</div>
			) : null}
			<Row>
				<span>Category:</span>
				<CategorySelect
					value={food.get('categoryId')}
					onChange={(val) => food.set('categoryId', val)}
				/>
			</Row>
			<Row>
				<span>Default list:</span>
				<ListSelect
					value={food.get('defaultListId')}
					onChange={(val) => food.set('defaultListId', val)}
					includeAll={false}
					inDialog
				/>
			</Row>
			<Divider />
			<div className="flex gap-1 flex-col">
				<Row>
					<span className="whitespace-nowrap">Expires after</span>
					<LiveUpdateTextField
						type="number"
						value={food.get('expiresAfterDays')?.toString() ?? ''}
						onChange={(val) => {
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
				</Row>
				<span className="text-xs">
					Set this and the app will remind you when something is about to
					expire.
				</span>
			</div>
			<Divider />
			<H3>Alternate names</H3>
			<FoodNamesEditor names={food.get('alternateNames')} />
			<label className="row gap-1">
				<Checkbox
					checked={food.get('pluralizeName')}
					onCheckedChange={(val) => food.set('pluralizeName', val === true)}
				/>
				<span>Use pluralized name</span>
			</label>
			<Divider />
			<label className="row gap-1">
				<Checkbox
					checked={food.get('doNotSuggest')}
					onCheckedChange={(val) => food.set('doNotSuggest', val === true)}
				/>
				<span>Do not suggest</span>
			</label>
			<Row>
				<Button
					onClick={() => {
						client.foods.delete(food.get('canonicalName'));
						setJustDeleted(true);
					}}
					color="destructive"
				>
					Delete
				</Button>
			</Row>
		</div>
	);
}

const Row = withClassName('div', 'flex flex-row items-center gap-1');

const FoodNameEditor = ({ food }: { food: Food }) => {
	const changeName = hooks.useChangeFoodCanonicalName();
	const [newName, setNewName] = useState(food.get('canonicalName'));
	const [editing, setEditing] = useState(false);

	if (editing) {
		return (
			<div className="row">
				<Input
					value={newName}
					onChange={(ev) => setNewName(ev.target.value ?? '')}
					placeholder={food.get('canonicalName')}
					autoSelect
					autoFocus
				/>
				{newName !== food.get('canonicalName') && (
					<Suspense
						fallback={
							<Button disabled color="primary">
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
			</div>
		);
	}
	return (
		<div className="row">
			<FoodName food={food} capitalize />
			<Tooltip content="Rename or merge">
				<Button size="icon" color="ghost" onClick={() => setEditing(true)}>
					<Icon name="pencil" />
				</Button>
			</Tooltip>
		</div>
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
		<Button color="primary" onClick={onSave}>
			<Icon name={!!merge ? 'convert' : 'check'} />
			<span>{!!merge ? 'Merge' : 'Rename'}</span>
		</Button>
	);
}
