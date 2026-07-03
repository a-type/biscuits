import {
	Box,
	Button,
	clsx,
	HorizontalList,
	Icon,
	P,
	tipTapClassName,
} from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { Editor } from '@tiptap/core';
import { EditorContent } from '@tiptap/react';
import { useSyncedInstructionsEditor } from '../hooks.js';
import { IncludeSubRecipe } from './IncludeSubRecipe.jsx';
import cls from './RecipeInstructionsField.module.css';

export interface RecipeInstructionsFieldProps {
	recipe: Recipe;
}

export function RecipeInstructionsField({
	recipe,
}: RecipeInstructionsFieldProps) {
	const editor = useSyncedInstructionsEditor({
		recipe,
		readonly: false,
		useBasicEditor: isMobileOs(),
	});

	return (
		<Box col gap="sm" surface="ambient" border p>
			{editor && <Toolbar editor={editor} />}
			<EditorContent editor={editor} className={clsx(tipTapClassName)} />
			<P emphasis="ambient" dim>
				Press <kbd>Enter</kbd> to create a new step. Each step line will have a
				checkbox you can use to track completion. I recommend keeping steps
				short and self-contained.
			</P>
		</Box>
	);
}

const simulateMobile =
	typeof window !== 'undefined' && window.location.search.includes('mobile');
function isMobileOs() {
	if (simulateMobile) return true;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent,
	);
}

function Toolbar({ editor }: { editor: Editor }) {
	return (
		// Sticks below the action bar
		<div className={cls.root}>
			<HorizontalList contentClassName={cls.list} className={cls.listOuter}>
				<Button
					emphasis={editor.isActive('bold') ? 'default' : 'ghost'}
					toggleMode="state-only"
					onClick={() => {
						editor.chain().focus().toggleMark('bold').run();
					}}
					disabled={!editor.can().chain().focus().toggleMark('bold').run()}
					toggled={editor.isActive('bold')}
				>
					<Icon name="bold" />
				</Button>
				<Button
					emphasis={editor.isActive('italic') ? 'default' : 'ghost'}
					toggleMode="state-only"
					onClick={() => {
						editor.chain().focus().toggleMark('italic').run();
					}}
					disabled={!editor.can().chain().focus().toggleMark('italic').run()}
					toggled={editor.isActive('italic')}
				>
					<Icon name="italic" />
				</Button>
				<Button
					emphasis={editor.isActive('sectionTitle') ? 'default' : 'ghost'}
					toggleMode="state-only"
					onClick={() => {
						editor.chain().focus().toggleSectionTitle().run();
					}}
					disabled={!editor.can().chain().focus().toggleSectionTitle().run()}
					toggled={editor.isActive('sectionTitle')}
				>
					<span aria-hidden className={cls.headingIcon}>
						H
					</span>
				</Button>
				<ToolbarEmbedButton editor={editor} />
			</HorizontalList>
		</div>
	);
}

function ToolbarEmbedButton({ editor }: { editor: Editor }) {
	const embedToCurrentStep = (recipe: Recipe) => {
		editor
			.chain()
			.focus()
			.splitBlock()
			.setNode('step', {
				subRecipeId: recipe.get('id'),
			})
			.run();
	};

	return (
		<IncludeSubRecipe
			onSelect={embedToCurrentStep}
			emphasis="ghost"
			size="small"
			className="@mode-denser"
			disabled={
				!editor
					.can()
					.chain()
					.focus()
					.splitBlock()
					.setNode('step', { subRecipeId: '' })
					.run()
			}
		>
			<Icon name="plus" size={10} />
			Embed recipe
		</IncludeSubRecipe>
	);
}
