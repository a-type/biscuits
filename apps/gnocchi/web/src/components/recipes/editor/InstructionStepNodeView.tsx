import { Icon } from '@/components/icons/Icon.jsx';
import { PersonSelect } from '@/components/sync/people/PersonSelect.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@gnocchi.biscuits/verdant';
// @ts-ignore
import { InstructionsContext } from '@/components/recipes/editor/InstructionsContext.jsx';
import {
	isActiveCookingSession,
	useCookSessionAction,
} from '@/components/recipes/hooks.js';
import {
	Button,
	Checkbox,
	CollapsibleContent,
	CollapsibleRoot,
	Note,
	TextArea,
	Tooltip,
	useToggle,
} from '@a-type/ui';
import { useHasServerAccess } from '@biscuits/client';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import classNames from 'classnames';
import {
	ChangeEvent,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
} from 'react';

export interface InstructionStepNodeViewProps {
	node: {
		attrs: { id: string; note?: string };
	};
	extension: {
		storage: { recipe?: Recipe };
	};
	updateAttributes: (attrs: { id?: string; note?: string }) => void;
}

export function InstructionStepNodeView({
	node,
	extension,
	updateAttributes,
	...rest
}: InstructionStepNodeViewProps) {
	const self = hooks.useSelf();
	const { isEditing, showTools } = useContext(InstructionsContext);

	const { id, note } = node.attrs;

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

	const completed = maybeCompletedSteps?.has(id);

	const sessionAction = useCookSessionAction(maybeRecipe || null);

	const assignedPersonId = maybeAssignments?.get(id) ?? null;

	const assignPersonId = useCallback(
		(personId: string | null) => {
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
		[maybeAssignments, id],
	);

	const isAssignedToMe = assignedPersonId === self.id;

	const updateNote = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			updateAttributes({ note: event.target.value });
		},
		[updateAttributes],
	);

	const onNoteBlur = useCallback(() => {
		if (note === '') {
			updateAttributes({ note: undefined });
		}
	}, [note, updateAttributes]);

	const isSubscribed = useHasServerAccess();

	return (
		<NodeViewWrapper
			data-id={node.attrs.id}
			className={classNames(
				'grid grid-areas-[label_label_label]-[tools_content_endTools]-[note_note_note]',
				'grid-cols-[min-content_1fr_min-content] grid-rows-[repeat(3,min-content)]',
				'mb-4 rounded-md w-full transition-colors',
				completed && !isEditing && 'opacity-60',
				isAssignedToMe && !isEditing && 'bg-primaryWash mb-2',
			)}
		>
			<div className="[grid-area:content]">
				<NodeViewContent />
			</div>
			<CollapsibleRoot
				open={showNote}
				className="[grid-area:note] mt-2 ml-auto"
				contentEditable={false}
			>
				<CollapsibleContent>
					<Note className="focus-within:shadow-focus" contentEditable={false}>
						<TextArea
							className="p-0 m-0 rounded-none border-none shadow-none bg-transparent text-sm w-full text-inherit [font-style:inherit] focus:(outline-none bg-transparent shadow-none)"
							value={note || ''}
							onChange={updateNote}
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
			{showTools && (
				<div
					className="flex flex-col items-center gap-2 [grid-area:tools] w-32px mr-2"
					contentEditable={false}
				>
					{!isEditing && (
						<Checkbox
							checked={!isEditing && completed}
							tabIndex={-1}
							contentEditable={false}
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
							className="relative top--1"
						/>
					)}
				</div>
			)}
			<div
				className="flex flex-col items-center gap-2 [grid-area:endTools] w-32px ml-3"
				contentEditable={false}
			>
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
					<Button color="ghost" size="icon" onClick={toggleShowNote}>
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
		</NodeViewWrapper>
	);
}

export const InstructionsProvider = ({
	isEditing,
	recipeId,
	children,
	showTools,
}: {
	recipeId: string;
	isEditing: boolean;
	showTools: boolean;
	children: ReactNode;
}) => {
	const hasPeers =
		hooks.useFindPeers((peer) => peer.presence.viewingRecipeId === recipeId)
			.length > 0;
	const value = useMemo(
		() => ({ isEditing, hasPeers, showTools }),
		[isEditing, hasPeers, showTools],
	);
	return (
		<InstructionsContext.Provider value={value}>
			{children}
		</InstructionsContext.Provider>
	);
};
