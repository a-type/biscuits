import { Recipe } from '@gnocchi.biscuits/verdant';
import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Link from '@tiptap/extension-link';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import cuid from 'cuid';
import { InstructionStepNodeView } from './InstructionStepNodeView.jsx';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		step: {
			setStep: () => ReturnType;
		};
		sectionTitle: {
			setSectionTitle: () => ReturnType;
			toggleSectionTitle: () => ReturnType;
		};
	}
}

interface StepOptions {
	HTMLAttributes: Record<string, any>;
}

interface SectionTitleOptions {
	HTMLAttributes: Record<string, any>;
}

export function createTiptapExtensions(recipe?: Recipe, basicEditor = false) {
	const Step = Node.create<StepOptions, { recipe?: Recipe }>({
		name: 'step',

		group: 'block',
		content: 'inline*',
		defining: true,
		priority: 1001,

		addOptions() {
			return {
				HTMLAttributes: {},
			};
		},

		addStorage() {
			return {
				recipe,
			};
		},

		addAttributes() {
			return {
				id: {
					default: null,
					keepOnSplit: false,
					rendered: false,
					parseHTML: (element) => element.getAttribute('data-id'),
					renderHTML: (attributes) => {
						return {
							'data-id': attributes.id,
						};
					},
				},
				note: {
					default: undefined,
					keepOnSplit: false,
					rendered: false,
					parseHTML: (element) => element.getAttribute('data-note'),
					renderHTML: (attributes) => {
						return {
							'data-note': attributes.note,
						};
					},
				},
				subRecipeId: {
					default: undefined,
					keepOnSplit: false,
					rendered: false,
					parseHTML: (element) => element.getAttribute('data-sub-recipe-id'),
					renderHTML: (attributes) => {
						return {
							'data-sub-recipe-id': attributes.subRecipeId,
						};
					},
				},
			};
		},

		parseHTML() {
			return [{ tag: 'p' }];
		},

		renderHTML({ node, HTMLAttributes }) {
			if (node.attrs.subRecipeId) {
				return [
					'p',
					mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
						'data-id': node.attrs.id,
						'data-sub-recipe-id': node.attrs.subRecipeId,
					}),
					'<embedded recipe>',
				];
			}
			return [
				'p',
				mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
					'data-id': node.attrs.id,
				}),
				0,
			];
		},

		addCommands() {
			return {
				setStep:
					() =>
					({ commands }) => {
						return commands.setNode(this.name);
					},
			};
		},

		...(!basicEditor
			? {
					addNodeView() {
						return ReactNodeViewRenderer(InstructionStepNodeView);
					},
			  }
			: {}),
	});

	const SectionTitle = Node.create<SectionTitleOptions>({
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
					parseHTML: (element) => element.getAttribute('data-id'),
					renderHTML: (attributes) => {
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

		renderHTML({ HTMLAttributes }) {
			return [
				'h3',
				mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
				0,
			];
		},
		addCommands() {
			return {
				setSectionTitle:
					() =>
					({ commands }) => {
						return commands.setNode(this.name);
					},
				toggleSectionTitle:
					() =>
					({ commands }) => {
						return commands.toggleNode(this.name, 'step');
					},
			};
		},
		addInputRules() {
			return [
				textblockTypeInputRule({
					find: /^#\\s$/,
					type: this.type,
				}),
			];
		},
	});

	const RecipeDocument = Document.extend({
		// the recipe document may only contain steps and section titles at the top level
		// and must contain at least one step
		content: '(step|sectionTitle)+',

		addProseMirrorPlugins() {
			return [
				/**
				 * This plugin adds a unique ID to every step and section title node
				 * that doesn't already have one. This is used to identify the node
				 * when it is rendered in the editor and when users complete
				 * different steps.
				 */
				new Plugin({
					key: new PluginKey('step-ids'),
					appendTransaction: (_: any, oldState: any, newState: any) => {
						// no changes
						if (newState.doc === oldState.doc) return;
						const tr = newState.tr;
						const usedIds = new Set<string>();
						newState.doc.descendants((node: any, pos: any, parent: any) => {
							if (
								(node.type.name === 'step' ||
									node.type.name === 'sectionTitle') &&
								(!node.attrs.id || usedIds.has(node.attrs.id))
							) {
								try {
									const id = cuid();
									tr.setNodeMarkup(pos, node.type, {
										...node.attrs,
										id,
									});
									usedIds.add(id);
								} catch (err) {
									console.error('Error assigning node ID', err);
								}
							} else {
								usedIds.add(node.attrs.id);
							}
						});
						return tr;
					},
				}),
			];
		},
	});

	// Until tiptap is full ESM, these types won't work...
	return [
		StarterKit.configure({ history: false, document: false }),
		Step,
		SectionTitle,
		RecipeDocument,
		Link,
	];
}
