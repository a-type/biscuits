import { instructionsToDoc, stringToDoc } from '@/lib/tiptap.js';
import { hooks } from '@/stores/groceries/index.js';
import {
	ActionBar,
	ActionButton,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@a-type/ui';
import { parseIngredient } from '@gnocchi.biscuits/conversion';
import cuid from 'cuid';
import { ReactNode, forwardRef, useCallback, useState } from 'react';

type PaprikaRecipe = {
	categories: string[];
	cook_time: string;
	created: string;
	description: string;
	difficulty: string;
	directions: string;
	hash: string;
	image_url: string;
	ingredients: string;
	name: string;
	notes: string;
	nutritional_info: string;
	photo: string;
	photo_data: string;
	photo_hash: string;
	photo_large: string;
	photos: unknown[];
	prep_time: string;
	rating: number;
	servings: string; // "4 servings"
	source: string;
	source_url: string;
	total_time: string;
	uid: string;
};

function readFileAsBuffer(file: Blob): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			resolve(reader.result as ArrayBuffer);
		};
		reader.onerror = reject;
		reader.readAsArrayBuffer(file);
	});
}

async function readEntries(file: File): Promise<PaprikaRecipe[]> {
	// dynamic import these since they're big
	const zip = await import('@zip.js/zip.js');
	const pako = await import('pako');

	const reader = new zip.ZipReader(new zip.BlobReader(file));
	const entries = await reader.getEntries();
	// each entry is a gzip file
	const promises = entries.map(async (entry) => {
		const data = await entry.getData?.(new zip.BlobWriter(), {});
		if (data) {
			const unzipped = pako.ungzip(await readFileAsBuffer(data));
			return unzipped;
		} else {
			return null;
		}
	});

	const data = (await Promise.all(promises)).filter(
		(x): x is Uint8Array => x !== null,
	);
	// read data as utf8 strings
	const strings = data.map((x) => new TextDecoder('utf-8').decode(x));
	// parse as JSON
	const json = strings.map((x) => JSON.parse(x));
	return json;
}

export interface PaprikaImporterProps {
	className?: string;
	children?: ReactNode;
	onClose?: () => void;
}

export const PaprikaImporter = forwardRef<
	HTMLLabelElement,
	PaprikaImporterProps
>(function PaprikaImporter({ className, children, onClose, ...rest }, ref) {
	const [data, setData] = useState<PaprikaRecipe[]>([]);
	const [selected, setSelected] = useState<Record<string, boolean>>({});
	const [loading, setLoading] = useState(false);

	const client = hooks.useClient();

	const importSelected = useCallback(() => {
		const recipes = data.filter((recipe) => selected[recipe.uid]);
		setLoading(true);
		const tagsToCreate = recipes.reduce((acc, recipe) => {
			acc.push(...(recipe.categories?.map((c) => c.toLowerCase()) ?? []));
			return acc;
		}, new Array<string>());
		client
			.batch({ max: null, timeout: null })
			.run(() => {
				const tagsPromise = Promise.all(
					tagsToCreate.map((tag) =>
						client.recipeTagMetadata.put({ name: tag }),
					),
				);
				const recipesPromise = Promise.all(
					recipes.map((recipe, i) =>
						client.recipes.put({
							slug: cuid.slug() + i,
							title: recipe.name,
							prelude: recipe.description
								? stringToDoc(recipe.description)
								: undefined,
							ingredients: recipe.ingredients?.split('\n').map((text) => {
								const parsed = parseIngredient(text);
								return {
									text: parsed.original,
									food: parsed.food,
									unit: parsed.unit,
									comments: parsed.comments,
									quantity: parsed.quantity,
								};
							}),
							instructions: instructionsToDoc(recipe.directions.split('\n')),
							note: recipe.notes,
							url: recipe.source_url,
							tags: recipe.categories
								? recipe.categories.map((c) => c.toLowerCase())
								: undefined,
							// TODO: support images?
						}),
					),
				);
				Promise.all([tagsPromise, recipesPromise])
					.then(() => {
						setData([]);
						onClose?.();
					})
					.finally(() => setLoading(false));
			})
			.flush();
	}, [data, selected, onClose]);

	return (
		<Dialog
			open={!!data.length}
			onOpenChange={(open) => {
				if (!open) {
					setData([]);
					setSelected({});
					onClose?.();
				}
			}}
		>
			<label className={className} ref={ref} {...rest}>
				<input
					type="file"
					accept=".paprikarecipes"
					onChange={async (e) => {
						const files = e.target.files;
						if (files) {
							const json = await readEntries(files[0]);
							console.log(json);
							setData(json);
							setSelected(
								json.reduce((acc, recipe) => {
									acc[recipe.uid] = true;
									return acc;
								}, {} as Record<string, boolean>),
							);
						}
					}}
					className="hidden-input"
				/>
				{children}
			</label>
			<DialogContent>
				<DialogTitle>Choose recipes</DialogTitle>
				<ActionBar className="flex-shrink-0">
					<ActionButton onClick={() => setSelected({})}>
						Select none
					</ActionButton>
					<ActionButton
						onClick={() =>
							setSelected((prev) => {
								const next = { ...prev };
								data.forEach((recipe) => (next[recipe.uid] = true));
								return next;
							})
						}
					>
						Select all
					</ActionButton>
				</ActionBar>
				<div className="flex flex-col items-stretch p-0 m-0 gap-2">
					{data.map((recipe) => (
						<RecipeItem
							key={recipe.uid}
							recipe={recipe}
							selected={selected[recipe.uid] ?? false}
							onSelectedChange={(selected) => {
								setSelected((prev) => ({ ...prev, [recipe.uid]: selected }));
							}}
						/>
					))}
				</div>
				<DialogActions>
					<DialogClose asChild>
						<Button>Cancel</Button>
					</DialogClose>
					<Button loading={loading} color="primary" onClick={importSelected}>
						import
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
});

export default PaprikaImporter;

function RecipeItem({
	recipe,
	selected,
	onSelectedChange,
}: {
	recipe: PaprikaRecipe;
	selected: boolean;
	onSelectedChange: (selected: boolean) => void;
}) {
	return (
		<label className="flex flex-row items-center p-2 gap-2">
			<Checkbox checked={selected} onCheckedChange={onSelectedChange} />
			<div className="flex-1 font-bold">{recipe.name}</div>
		</label>
	);
}
