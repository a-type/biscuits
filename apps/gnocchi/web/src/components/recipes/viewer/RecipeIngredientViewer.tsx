import { Icon } from '@/components/icons/Icon.jsx';
import { useUnitConversion } from '@/components/recipes/viewer/unitConversion.js';
import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	CollapsibleContent,
	CollapsibleRoot,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	useToggle,
} from '@a-type/ui';
import { fractionToText } from '@a-type/utils';
import { convertUnits, lookupUnit } from '@gnocchi.biscuits/conversion';
import { RecipeIngredientsItem } from '@gnocchi.biscuits/verdant';
import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
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
	const { note, isSectionHeader, quantity, unit, food } =
		hooks.useWatch(ingredient);
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
			.from(officialUnit.abbr)
			.to(conversion);
		return `${fractionToText(result)} ${friendlyUnit(
			conversion,
			result === 1,
		)}`;
	}, [conversion, officialUnit, quantity, multiplier]);

	const convertOptions: string[] = useMemo(() => {
		if (!officialUnit) return [];
		try {
			const possibilities = convertUnits()
				.from(officialUnit.abbr)
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

	const add = hooks.useAddIngredients();
	const addToList = useCallback(async () => {
		add([ingredient.getSnapshot()], { multiplier, recipeId, showToast: true });
	}, [ingredient, multiplier, add, recipeId]);

	return (
		<div
			className={classNames(
				'flex flex-col items-end gap-1',
				isSectionHeader && 'font-bold',
				className,
			)}
		>
			<div className="flex flex-row w-full items-start">
				<IngredientText
					className="flex-1 block mt-1"
					// don't multiply section headers.
					multiplier={isSectionHeader ? 1 : multiplier}
					ingredient={ingredient}
				/>
				<div className="flex flex-row gap-2 items-center relative top--1">
					{conversionEnabled && (
						<>
							<DropdownMenu
								onOpenChange={(open) => {
									if (open) resetConversion();
								}}
							>
								<DropdownMenuTrigger asChild>
									<Button size="icon" color="ghost">
										<Icon name="convert" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuLabel className="text-sm font-bold py-1 pl-3">
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
						<Button size="icon" color="ghost" onClick={addToList}>
							<Icon name="add_to_list" className="color-gray7" />
						</Button>
					)}
					{!disableAddNote && (
						<Button size="icon" color="ghost" onClick={toggleShowNote}>
							{!!note ? (
								<Icon
									name="note"
									className={
										showNote
											? undefined
											: 'color-primaryDark fill-primary stroke-primaryDark'
									}
								/>
							) : (
								<Icon name="add_note" className="color-gray7" />
							)}
						</Button>
					)}
				</div>
			</div>
			<CollapsibleRoot
				open={!!conversion}
				className="mr-auto self-start italic color-gray7"
			>
				<CollapsibleContent className="pr-2">
					<span className="text-xs inline-flex items-center gap-1">
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
	const details = defaultConvert.describe(abbr);
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
