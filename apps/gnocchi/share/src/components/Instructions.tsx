import {
	Button,
	clsx,
	Collapsible,
	Icon,
	Note,
	tipTapClassName,
	tipTapReadonlyClassName,
} from '@a-type/ui';
import { tiptapToString } from '@biscuits/client';
import { FragmentOf, graphql, readFragment, Unmasked } from '@biscuits/graphql';
import {
	PublicRecipeStepNode,
	type PublicRecipe,
} from '@gnocchi.biscuits/share-schema';
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

export const instructionsFragment = graphql(`
	fragment Instructions on PublishedRecipeData {
		id
		instructions
		embeddedRecipes {
			id
			title
			instructions
			embeddedRecipes {
				id
				title
				instructions
			}
		}
	}
`);

export interface InstructionsProps {
	data: FragmentOf<typeof instructionsFragment>;
	className?: string;
}

export function MachineReadableInstructions({
	data: dataMasked,
}: InstructionsProps) {
	const data = readFragment(instructionsFragment, dataMasked);
	const instructionsData = data.instructions as PublicRecipe['instructions'];
	return (
		<div className="e-instructions hidden" itemProp="recipeInstructions">
			{(instructionsData.content ?? []).map((block) => {
				if (!block) return null;

				switch (block.type) {
					case 'step':
						return (
							<MachineReadableStep
								key={block.attrs.id}
								data={dataMasked}
								step={block as PublicRecipeStepNode}
							/>
						);
					case 'sectionTitle':
						return (
							<h2 key={block.attrs.id} data-section-title="true">
								{tiptapToString(block)}
							</h2>
						);
					default:
						return null;
				}
			})}
		</div>
	);
}

function MachineReadableStep({
	step,
	data: masked,
}: {
	step: PublicRecipeStepNode;
	data: FragmentOf<typeof instructionsFragment>;
}) {
	if (step.attrs.subRecipeId) {
		const data = readFragment(instructionsFragment, masked);
		const embeddedRecipe = data.embeddedRecipes.find(
			(r) => r.id === step.attrs.subRecipeId,
		);
		if (embeddedRecipe) {
			return (
				<div>
					<h2>Make {embeddedRecipe.title}:</h2>
					<MachineReadableInstructions data={embeddedRecipe as any} />
				</div>
			);
		}
	}
	return <p>{tiptapToString(step)}</p>;
}

export function Instructions({
	data: dataMasked,
	className,
}: InstructionsProps) {
	const data = readFragment(instructionsFragment, dataMasked);
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
	return (
		<InstructionsContext.Provider value={data as any}>
			<EditorContent
				className={clsx(
					tipTapClassName,
					tipTapReadonlyClassName,
					'[&>div]:p-0',
					className,
				)}
				editor={editor}
				readOnly
			/>
		</InstructionsContext.Provider>
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
	const data = readFragment(
		instructionsFragment,
		useContext(InstructionsContext),
	);
	const embeddedRecipe =
		node.attrs.subRecipeId ?
			data.embeddedRecipes.find((r) => r.id === node.attrs.subRecipeId)
		:	null;
	return (
		<NodeViewWrapper
			data-id={node.attrs.id}
			className="mb-5 w-full flex flex-col gap-sm p-1"
			contentEditable={false}
		>
			<div>
				{!embeddedRecipe && <NodeViewContent />}
				{embeddedRecipe && (
					<Collapsible>
						<Collapsible.Trigger
							render={
								<Button emphasis="ghost" size="small" className="italic" />
							}
						>
							<Icon
								name="chevron"
								className="transition-all [[data-state=open]_&]:rotate-180"
							/>
							Make {embeddedRecipe.title}
						</Collapsible.Trigger>
						<Collapsible.Content>
							<Instructions className="pl-sm" data={embeddedRecipe as any} />
						</Collapsible.Content>
					</Collapsible>
				)}
			</div>
			{node.attrs.note && (
				<Note className="ml-auto mt-2 max-w-80% w-max-content" data-note="true">
					{node.attrs.note}
				</Note>
			)}
		</NodeViewWrapper>
	);
}

const InstructionsContext = createContext<
	FragmentOf<Unmasked<typeof instructionsFragment>>
>(null!);
