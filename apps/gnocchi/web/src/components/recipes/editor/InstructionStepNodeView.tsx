import { InstructionsContext } from '@/components/recipes/editor/InstructionsContext.jsx';
import {
	isActiveCookingSession,
	useCookSessionAction,
} from '@/components/recipes/hooks.js';
import { PersonSelect } from '@/components/sync/people/PersonSelect.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	Checkbox,
	clsx,
	CollapsibleContent,
	CollapsibleRoot,
	Icon,
	Note,
	TextArea,
	Tooltip,
	useToggle,
} from '@a-type/ui';
import { useHasServerAccess } from '@biscuits/client';
import { Recipe } from '@gnocchi.biscuits/verdant';
import {
	NodeViewContent,
	NodeViewWrapper,
	Editor as TipTapEditor,
} from '@tiptap/react';
import classNames from 'classnames';
import { ReactNode, Suspense, useCallback, useContext, useMemo } from 'react';
import {
	EmbeddedSubRecipeContent,
	EmbeddedSubRecipeInstructionsToggle,
	EmbeddedSubRecipeInstructionsWrapper,
} from './EmbeddedSubRecipeInstructons.jsx';
import { IncludeSubRecipe } from './IncludeSubRecipe.jsx';

export interface InstructionStepAttributes {
	id?: string;
	note?: string;
	subRecipeId?: string;
}

export interface InstructionStepNodeViewProps {
	node: {
		attrs: InstructionStepAttributes;
		content?: any;
	};
	extension: {
		storage: { recipe?: Recipe };
	};
	updateAttributes: (attrs: Partial<InstructionStepAttributes>) => void;
	editor: TipTapEditor;
}

export function InstructionStepNodeView({
	node,
	extension,
	updateAttributes,
	editor,
}: InstructionStepNodeViewProps) {
	const self = hooks.useSelf();
	const parentCtx = useContext(InstructionsContext);
	const { isEditing } = parentCtx;

	const { id, note, subRecipeId } = node.attrs;
	const hasContent = node.content?.content?.length > 0 || !!subRecipeId;

	const [showNote, toggleShowNote] = useToggle(!!note);

	const maybeRecipe = extension.storage.recipe;
	hooks.useWatch(maybeRecipe || null);
	let maybeSession = maybeRecipe?.get('session') ?? null;
	if (!isActiveCookingSession(maybeSession)) {
		maybeSession = null;
	}
	hooks.useWatch(maybeSession || null);
	const maybeCompletedSteps = maybeSession
		? maybeSession.get('completedInstructions')
		: null;
	hooks.useWatch(maybeCompletedSteps);
	const maybeAssignments = maybeSession
		? maybeSession.get('instructionAssignments')
		: null;
	hooks.useWatch(maybeAssignments);

	const completed = id && maybeCompletedSteps?.has(id);

	const sessionAction = useCookSessionAction(maybeRecipe || null);

	const assignedPersonId = id ? maybeAssignments?.get(id) ?? null : null;

	const assignPersonId = useCallback(
		(personId: string | null) => {
			if (!id) return;
			if (!maybeAssignments) {
				if (maybeRecipe && personId) {
					maybeRecipe.set('session', {
						instructionAssignments: {
							[id]: personId,
						},
					});
				}
				return;
			}

			sessionAction((session) => {
				if (personId) {
					session?.get('instructionAssignments').set(id, personId);
				} else {
					session?.get('instructionAssignments').delete(id);
				}
			});
		},
		[maybeAssignments, id, maybeRecipe, sessionAction],
	);

	const isAssignedToMe = assignedPersonId === self.id;

	const updateNote = useCallback(
		(value: string) => {
			updateAttributes({ note: value });
		},
		[updateAttributes],
	);

	const onNoteBlur = useCallback(() => {
		if (note === '') {
			updateAttributes({ note: undefined });
		}
	}, [note, updateAttributes]);

	const embedRecipe = useCallback(
		(recipe: Recipe) => {
			updateAttributes({ subRecipeId: recipe.get('id') });
			editor.commands.splitBlock();
			editor.commands.focus();
		},
		[updateAttributes, editor],
	);

	const removeSelf = useCallback(() => {
		editor.commands.deleteCurrentNode();
		editor.commands.focus();
	}, [editor]);

	const isSubscribed = useHasServerAccess();

	const embeddedCtx = useMemo(
		() => ({ ...parentCtx, isEditing: false }),
		[parentCtx],
	);

	return (
		<EmbeddedSubRecipeInstructionsWrapper
			render={
				<NodeViewWrapper
					data-id={node.attrs.id}
					className={classNames(
						'grid grid-areas-[label_label_label]-[tools_content_endTools]-[note_note_note]-[embed_embed_embed]',
						'grid-cols-[min-content_1fr_min-content] grid-rows-[repeat(3,min-content)]',
						'mb-2 rounded-md w-full transition-colors items-start',
						completed && !isEditing && 'opacity-60',
						isAssignedToMe && !isEditing && 'bg-primaryWash mb-2',
					)}
				/>
			}
		>
			<div
				className={clsx(
					'[grid-area:content] relative flex flex-row gap-2 items-start pt-2 justify-between',
					!subRecipeId && 'items-center',
				)}
			>
				{subRecipeId ? (
					<InstructionsContext value={embeddedCtx}>
						<Suspense fallback={<div>Loading sub-recipe</div>}>
							<EmbeddedSubRecipeInstructionsToggle
								recipeId={subRecipeId}
								className="mt--1"
							/>
						</Suspense>
					</InstructionsContext>
				) : (
					<NodeViewContent />
				)}
				{!hasContent && isEditing && (
					<>
						<div className="absolute left-0 top-4 sm:top-2 opacity-50 text-xs sm:text-sm">
							Type something, or...
						</div>
						<IncludeSubRecipe
							emphasis="default"
							size="small"
							onSelect={embedRecipe}
							className="opacity-50 hover:opacity-100"
						/>
					</>
				)}
			</div>
			<CollapsibleRoot
				open={showNote}
				className="[grid-area:note] mt-2 ml-auto w-max-content max-w-400px"
				contentEditable={false}
			>
				<CollapsibleContent>
					<Note className="focus-within:shadow-focus" contentEditable={false}>
						<TextArea
							className="p-0 m-0 rounded-none border-none shadow-none bg-transparent text-sm w-full text-inherit [font-style:inherit] focus:(outline-none bg-transparent shadow-none)"
							value={note || ''}
							onValueChange={updateNote}
							onBlur={onNoteBlur}
							autoSize
							autoFocus={note === ''}
						/>
					</Note>
				</CollapsibleContent>
			</CollapsibleRoot>
			{!isEditing && isAssignedToMe && (
				<label
					contentEditable={false}
					className="[grid-area:label] text-xs italic color-black animate-keyframes-fade-in-up animate-duration-200 animate-ease-out mb-2"
				>
					Assigned to you
				</label>
			)}
			{!isEditing && (
				<div
					className="flex flex-col items-center gap-2 [grid-area:tools] w-32px mr-2 pt-1"
					contentEditable={false}
				>
					<Checkbox
						checked={!isEditing && !!completed}
						contentEditable={false}
						checkedMode="faded"
						onCheckedChange={(checked) => {
							if (!id) {
								return;
							}

							sessionAction((session) => {
								if (checked) {
									session?.get('completedInstructions').add(id);
								} else {
									session?.get('completedInstructions').removeAll(id);
								}
							});
						}}
						className="relative"
					/>
				</div>
			)}
			<div
				className="flex flex-col items-center gap-1 [grid-area:endTools] w-32px ml-3"
				contentEditable={false}
			>
				{isEditing && (
					<Button emphasis="ghost" size="small" onClick={removeSelf}>
						<Icon name="x" />
					</Button>
				)}
				{!isEditing && isSubscribed && (
					<PersonSelect
						includeSelf
						allowNone
						value={assignedPersonId}
						onChange={assignPersonId}
						label="Assign to:"
					/>
				)}
				<Tooltip
					content={
						note === undefined
							? 'Add a note'
							: showNote
							? 'Hide note'
							: 'Show note'
					}
				>
					<Button emphasis="ghost" onClick={toggleShowNote}>
						{!!note ? (
							<Icon
								name="note"
								className={
									showNote
										? undefined
										: 'fill-primary stroke-primaryDark color-primaryDark'
								}
							/>
						) : (
							<Icon name="add_note" className="color-gray7" />
						)}
					</Button>
				</Tooltip>
			</div>
			{subRecipeId && (
				<EmbeddedSubRecipeContent
					recipeId={subRecipeId}
					className="[grid-area:embed]"
				/>
			)}
		</EmbeddedSubRecipeInstructionsWrapper>
	);
}

export const InstructionsProvider = ({
	isEditing,
	recipeId,
	children,
}: {
	recipeId: string;
	isEditing: boolean;
	children: ReactNode;
}) => {
	const hasPeers =
		hooks.useFindPeers((peer) => peer.presence.viewingRecipeId === recipeId)
			.length > 0;
	const value = useMemo(() => ({ isEditing, hasPeers }), [isEditing, hasPeers]);
	return (
		<InstructionsContext.Provider value={value}>
			{children}
		</InstructionsContext.Provider>
	);
};
