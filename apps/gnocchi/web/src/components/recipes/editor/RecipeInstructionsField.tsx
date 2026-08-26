import {
	Box,
	Button,
	clsx,
	HorizontalList,
	Icon,
	Input,
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
	className?: string;
}

export function RecipeInstructionsField({
	recipe,
	className,
}: RecipeInstructionsFieldProps) {
	const editor = useSyncedInstructionsEditor({
		recipe,
		readonly: false,
		useBasicEditor: isMobileOs(),
	});

	return (
		<Input.Border className={clsx(cls.root, className)}>
			<Box col gap="sm">
				{editor && <Toolbar editor={editor} />}
				<EditorContent
					editor={editor}
					className={clsx(tipTapClassName, cls.editor)}
				/>
				<P emphasis="ambient" dim className={cls.tip}>
					Press <kbd>Enter</kbd> to create a new step. Each step line will have
					a checkbox you can use to track completion. I recommend keeping steps
					short and self-contained.
				</P>
			</Box>
		</Input.Border>
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
		<div className={cls.toolbar}>
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
					<Button.Icon data-icon aria-hidden className={cls.headingIcon}>
						H
					</Button.Icon>
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
