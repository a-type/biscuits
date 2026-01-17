import { useUnitConversion } from '@/components/recipes/viewer/unitConversion.js';
import { hooks } from '@/stores/groceries/index.js';
import { useAddIngredients } from '@/stores/groceries/mutations.js';
import {
	Button,
	CollapsibleContent,
	CollapsibleRoot,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	Icon,
	useToggle,
} from '@a-type/ui';
import { fractionToText } from '@a-type/utils';
import { convertUnits, lookupUnit } from '@gnocchi.biscuits/conversion';
import { RecipeIngredientsItem } from '@gnocchi.biscuits/verdant';
import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { NoteEditor } from '../editor/NoteEditor.jsx';
import { IngredientText } from './IngredientText.jsx';

(window as any).convertUnits = convertUnits;

export interface RecipeIngredientViewerProps {
	ingredient: RecipeIngredientsItem;
	multiplier?: number;
	className?: string;
	disableAddNote?: boolean;
	disableAddToList?: boolean;
	recipeId: string;
}

export function RecipeIngredientViewer({
	ingredient,
	multiplier = 1,
	className,
	disableAddNote,
	disableAddToList,
	recipeId,
}: RecipeIngredientViewerProps) {
	const { note, isSectionHeader, quantity, unit } = hooks.useWatch(ingredient);
	const officialUnit = lookupUnit(unit);
	const [conversion, setConversion] = useUnitConversion(officialUnit?.abbr);

	const [showNote, toggleShowNote] = useToggle(!!note);

	const onNoteBlur = useCallback(() => {
		if (!note) {
			toggleShowNote();
		}
	}, [note, toggleShowNote]);

	const convertedValue = useMemo(() => {
		if (!conversion || !officialUnit) return undefined;
		const result = convertUnits(quantity * multiplier)
			.from(officialUnit.abbr as any)
			.to(conversion as any);
		return `${fractionToText(result)} ${friendlyUnit(
			conversion,
			result === 1,
		)}`;
	}, [conversion, officialUnit, quantity, multiplier]);

	const convertOptions: string[] = useMemo(() => {
		if (!officialUnit) return [];
		try {
			const possibilities = convertUnits()
				.from(officialUnit.abbr as any)
				.possibilities();
			return possibilities
				.filter((opt: string) => usefulUnits.includes(opt))
				.filter((opt: string) => opt !== officialUnit.abbr);
		} catch {
			return [];
		}
	}, [officialUnit]);

	const conversionEnabled =
		!!officialUnit && !!convertOptions.length && !isSectionHeader;

	const resetConversion = useCallback(() => {
		setConversion(undefined);
	}, [setConversion]);

	const add = useAddIngredients();
	const [added, setAdded] = useState(false);
	const addToList = useCallback(async () => {
		add([ingredient.getSnapshot()], { multiplier, recipeId });
		setAdded(true);
	}, [ingredient, multiplier, add, recipeId]);

	return (
		<div
			className={classNames(
				'flex flex-col items-end gap-1',
				isSectionHeader && 'font-bold',
				className,
			)}
		>
			<div className="w-full flex flex-row items-start">
				<IngredientText
					className="mt-1 block flex-1"
					// don't multiply section headers.
					multiplier={isSectionHeader ? 1 : multiplier}
					ingredient={ingredient}
				/>
				<div className="relative top--1 flex flex-row items-center gap-2">
					{conversionEnabled && (
						<>
							<DropdownMenu
								onOpenChange={(open) => {
									if (open) resetConversion();
								}}
							>
								<DropdownMenuTrigger render={<Button emphasis="ghost" />}>
									<Icon name="convert" />
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuLabel className="py-1 pl-3 text-sm font-bold">
										Convert to:
									</DropdownMenuLabel>
									{convertOptions.map((opt) => (
										<DropdownMenuItem
											key={opt}
											onSelect={() => setConversion(opt)}
										>
											{friendlyUnit(opt)}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					)}
					{!isSectionHeader && !disableAddToList && (
						<Button emphasis="ghost" onClick={addToList} disabled={added}>
							<Icon name={added ? 'check' : 'add_to_list'} />
						</Button>
					)}
					{!disableAddNote && (
						<Button emphasis="ghost" onClick={toggleShowNote}>
							{!!note ? (
								<Icon
									name="note"
									className={
										showNote
											? undefined
											: 'color-primary-dark fill-primary stroke-primary-dark'
									}
								/>
							) : (
								<Icon name="add_note" />
							)}
						</Button>
					)}
				</div>
			</div>
			<CollapsibleRoot
				open={!!conversion}
				className="mr-auto self-start italic"
			>
				<CollapsibleContent className="pr-2">
					<span className="inline-flex items-center gap-1 text-xs">
						<Icon name="convert" size={15} />
						{convertedValue}
					</span>
				</CollapsibleContent>
			</CollapsibleRoot>
			<CollapsibleRoot open={showNote}>
				<CollapsibleContent>
					<NoteEditor
						value={note || ''}
						onChange={(val) => ingredient.set('note', val)}
						autoFocus={!note}
						onBlur={onNoteBlur}
					/>
				</CollapsibleContent>
			</CollapsibleRoot>
		</div>
	);
}

const defaultConvert = convertUnits();
function friendlyUnit(abbr: string, singular = false) {
	const details = defaultConvert.describe(abbr as any);
	if (!details) return '';
	return singular ? details.singular : details.plural;
}

const usefulUnits = [
	'ml',
	'g',
	'kg',
	'oz',
	'lb',
	'cup',
	'tsp',
	'Tbs',
	'pt',
	'qt',
	'gal',
	'fl-oz',
	'png',
	'quart',
	'cm',
	'm',
	'in',
	'ft',
];
