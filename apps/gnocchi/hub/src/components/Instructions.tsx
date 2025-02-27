'use client';

import { HubRecipeData } from '@/types.js';
import {
	Button,
	clsx,
	Collapsible,
	Icon,
	Note,
	tipTapClassName,
	tipTapReadonlyClassName,
} from '@a-type/ui';
import { mergeAttributes, Node } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import {
	EditorContent,
	NodeViewContent,
	NodeViewWrapper,
	ReactNodeViewRenderer,
	useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { createContext, useContext } from 'react';

export interface InstructionsProps {
	data: HubRecipeData;
	className?: string;
}

export function Instructions({ data, className }: InstructionsProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				history: false,
			}),
			Step,
			SectionTitle,
			Link,
		],
		content: data.instructions,
		editable: false,
	});
	console.log('rendering instructions', data.title);
	return (
		<div
			className={clsx('e-instructions', className)}
			itemProp="recipeInstructions"
		>
			<InstructionsContext.Provider value={data}>
				<EditorContent
					className={clsx(tipTapClassName, tipTapReadonlyClassName)}
					editor={editor}
					readOnly
				/>
			</InstructionsContext.Provider>
		</div>
	);
}

const Step = Node.create({
	name: 'step',
	group: 'block',
	content: 'inline*',
	defining: true,
	priority: 1001,

	addAttributes() {
		return {
			id: {
				default: null,
				keepOnSplit: false,
				rendered: false,
				parseHTML: (element: HTMLElement) => element.getAttribute('data-id'),
				renderHTML: (attributes: any) => {
					return {
						'data-id': attributes.id,
					};
				},
			},
			note: {
				default: undefined,
				keepOnSplit: false,
				rendered: false,
				parseHTML: (element: HTMLElement) => element.getAttribute('data-note'),
				renderHTML: (attributes: any) => {
					return {
						'data-note': attributes.note,
					};
				},
			},
			subRecipeId: {
				default: undefined,
				keepOnSplit: false,
				rendered: false,
				parseHTML: (element: HTMLElement) =>
					element.getAttribute('data-sub-recipe-id'),
				renderHTML: (attributes: any) => {
					return {
						'data-sub-recipe-id': attributes.subRecipeId,
					};
				},
			},
		};
	},

	addOptions() {
		return {
			HTMLAttributes: {},
		};
	},

	parseHTML() {
		return [{ tag: 'p' }];
	},

	renderHTML({ node, HTMLAttributes }: any) {
		return [
			'p',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				'data-id': node.attrs.id,
			}),
			0,
		];
	},

	addNodeView() {
		return ReactNodeViewRenderer(InstructionStepView);
	},
});

const SectionTitle = Node.create({
	name: 'sectionTitle',
	content: 'inline*',
	defining: true,
	group: 'block',

	addAttributes() {
		return {
			id: {
				default: null,
				keepOnSplit: false,
				rendered: false,
				parseHTML: (element: HTMLElement) => element.getAttribute('data-id'),
				renderHTML: (attributes: any) => {
					return {
						'data-id': attributes.id,
					};
				},
			},
		};
	},

	parseHTML() {
		return [{ tag: 'h2' }, { tag: 'h1' }, { tag: 'h3' }];
	},

	renderHTML({ HTMLAttributes }: any) {
		return [
			'h2',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				'data-section-title': true,
			}),
			0,
		];
	},
});

function InstructionStepView({
	node,
}: {
	node: {
		attrs: {
			id?: string;
			note?: string;
			subRecipeId?: string;
		};
	};
}) {
	const data = useContext(InstructionsContext);
	const embeddedRecipe =
		node.attrs.subRecipeId ?
			data.embeddedRecipes[node.attrs.subRecipeId]
		:	null;
	return (
		<NodeViewWrapper
			data-id={node.attrs.id}
			className="flex flex-col mb-5 w-full p-1 gap-sm"
			contentEditable={false}
		>
			<div>
				{!embeddedRecipe && <NodeViewContent />}
				{embeddedRecipe && (
					<Collapsible>
						<Collapsible.Trigger asChild>
							<Button color="ghost" size="small" className="italic">
								<Icon
									name="chevron"
									className="transition-all [[data-state=open]_&]:rotate-180"
								/>
								Make {embeddedRecipe.title}
							</Button>
						</Collapsible.Trigger>
						<Collapsible.Content>
							<Instructions className="pl-sm" data={embeddedRecipe} />
						</Collapsible.Content>
					</Collapsible>
				)}
			</div>
			{node.attrs.note && (
				<Note className="mt-2 ml-auto max-w-80% w-max-content" data-note="true">
					{node.attrs.note}
				</Note>
			)}
		</NodeViewWrapper>
	);
}

const InstructionsContext = createContext<HubRecipeData>(null!);
