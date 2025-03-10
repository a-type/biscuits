import { Button, clsx, Icon, P, tipTapClassName } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { Editor } from '@tiptap/core';
import { EditorContent } from '@tiptap/react';
import { useSyncedInstructionsEditor } from '../hooks.js';
import { IncludeSubRecipe } from './IncludeSubRecipe.jsx';

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
	(window as any).recipe = recipe;

	return (
		<div className="flex flex-col gap-2">
			{editor && <Toolbar editor={editor} />}
			<EditorContent editor={editor} className={clsx(tipTapClassName)} />
			<P className="text-xs">
				Press <kbd>Enter</kbd> to create a new step. Each step line will have a
				checkbox you can use to track completion. I recommend keeping steps
				short and self-contained.
			</P>
		</div>
	);
}

function isMobileOs() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent,
	);
}

function Toolbar({ editor }: { editor: Editor }) {
	return (
		// Sticks below the action bar
		<div className="flex flex-row gap-sm items-center sticky z-1 top-44px bg-wash border-b border-b-gray-dark border-b-solid">
			<Button
				color="ghost"
				onClick={() => {
					editor.chain().focus().toggleMark('bold').run();
				}}
				disabled={!editor.can().chain().focus().toggleMark('bold').run()}
				toggled={editor.isActive('bold')}
				className="[font-size:12px]"
			>
				<Icon name="bold" />
			</Button>
			<Button
				color="ghost"
				onClick={() => {
					editor.chain().focus().toggleMark('italic').run();
				}}
				disabled={!editor.can().chain().focus().toggleMark('italic').run()}
				toggled={editor.isActive('italic')}
				className="[font-size:12px]"
			>
				<Icon name="italic" />
			</Button>
			<Button
				color="ghost"
				onClick={() => {
					editor.chain().focus().toggleSectionTitle().run();
				}}
				disabled={!editor.can().chain().focus().toggleSectionTitle().run()}
				toggled={editor.isActive('sectionTitle')}
				className="[font-size:12px]"
			>
				<span>H</span>
			</Button>
			<ToolbarEmbedButton editor={editor} />
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
			color="ghost"
			className="[font-size:12px] gap-sm"
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
