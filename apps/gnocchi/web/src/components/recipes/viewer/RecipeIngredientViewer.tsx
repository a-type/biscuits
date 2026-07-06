import { NoteIcon } from '@/components/note/NoteIcon.jsx';
import { useUnitConversion } from '@/components/recipes/viewer/unitConversion.js';
import { hooks } from '@/stores/groceries/index.js';
import { useAddIngredients } from '@/stores/groceries/mutations.js';
import {
	Box,
	Button,
	CollapsibleContent,
	CollapsibleRoot,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	Icon,
	Text,
	useToggle,
} from '@a-type/ui';
import { fractionToText } from '@a-type/utils';
import { convertUnits, lookupUnit } from '@gnocchi.biscuits/conversion';
import { RecipeIngredientsItem } from '@gnocchi.biscuits/verdant';
import { CSSProperties, useCallback, useMemo, useState } from 'react';
import { NoteEditor } from '../editor/NoteEditor.jsx';
import { IngredientText } from './IngredientText.jsx';
import cls from './RecipeIngredientViewer.module.css';

export interface RecipeIngredientViewerProps {
	ingredient: RecipeIngredientsItem;
	multiplier?: number;
	className?: string;
	disableAddNote?: boolean;
	disableAddToList?: boolean;
	recipeId: string;
	style?: CSSProperties;
}

export function RecipeIngredientViewer({
	ingredient,
	multiplier = 1,
	className,
	disableAddNote,
	disableAddToList,
	recipeId,
	style,
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
		<Box col items="end" gap="sm" className={className} style={style}>
			<Box full="width" items="start">
				<IngredientText
					style={{ marginTop: 4, display: 'block', flex: 1 }}
					multiplier={multiplier}
					ingredient={ingredient}
				/>
				<Box items="center" gap="xs" dim>
					{conversionEnabled && (
						<>
							<DropdownMenu
								onOpenChange={(open) => {
									if (open) resetConversion();
								}}
							>
								<DropdownMenuTrigger render={<Button emphasis="ghost" />}>
									<Icon name="convert" className={cls.icon} />
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuLabel>Convert to:</DropdownMenuLabel>
									{convertOptions.map((opt) => (
										<DropdownMenuItem
											key={opt}
											onClick={() => setConversion(opt)}
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
							<Icon
								name={added ? 'check' : 'add_to_list'}
								className={cls.icon}
							/>
						</Button>
					)}
					{!disableAddNote && (
						<Button emphasis="ghost" onClick={toggleShowNote}>
							<NoteIcon open={showNote} hasNote={!!note} />
						</Button>
					)}
				</Box>
			</Box>
			<CollapsibleRoot open={!!conversion} style={{ marginRight: 'auto' }}>
				<CollapsibleContent className="pr-2">
					<Text
						italic
						emphasis="ambient"
						dim
						render={<Box items="center" gap="xs" />}
					>
						<Icon name="convert" size={15} />
						{convertedValue}
					</Text>
				</CollapsibleContent>
			</CollapsibleRoot>
			<CollapsibleRoot open={showNote}>
				<CollapsibleContent>
					<NoteEditor
						value={note || ''}
						onChange={(val) => ingredient.set('note', val)}
						autoFocus={!note}
						onBlur={onNoteBlur}
						style={{ fontStyle: 'italic' }}
					/>
				</CollapsibleContent>
			</CollapsibleRoot>
		</Box>
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
