import { hooks } from '@/hooks.js';
import {
	Box,
	Button,
	ConfirmedButton,
	Dialog,
	H3,
	Icon,
	ImageUploader,
	LiveUpdateTextField,
} from '@a-type/ui';
import { List } from '@wish-wash.biscuits/verdant';
import {
	useConvertToPrivate,
	useConvertToShared,
	useDeleteList,
} from './hooks.js';

export interface ListHeroProps {
	list: List;
	className?: string;
}

export function ListHero({ list, className }: ListHeroProps) {
	const { name, coverImage } = hooks.useWatch(list);
	hooks.useWatch(coverImage);

	const convertToShared = useConvertToShared(list);
	const convertToPrivate = useConvertToPrivate(list);
	const deleteList = useDeleteList(list);
	const isPrivate = list.isAuthorized;

	return (
		<Box col items="start" className={className}>
			{coverImage?.url && (
				<img
					src={coverImage.url}
					className="h-[20vh] w-full rounded-lg object-cover"
				/>
			)}
			<Box items="center">
				<Dialog>
					<Icon name={list.isAuthorized ? 'lock' : 'add_person'} />
					<Dialog.Trigger
						render={
							<Button emphasis="ghost" className="gap-md text-xl font-bold" />
						}
					>
						{name}
						<Icon name="gear" />
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Title>Edit list</Dialog.Title>
						<Dialog.Description>
							Edit list details or change privacy settings.
						</Dialog.Description>
						<Box col gap>
							<ImageUploader
								className="aspect-16/8 w-full"
								value={coverImage?.url ?? null}
								onChange={(v) => list.set('coverImage', v)}
							/>
							<LiveUpdateTextField
								className="text-xl"
								value={name}
								onChange={(v) => list.set('name', v)}
							/>
							<Box col gap items="start">
								<H3>Manage</H3>
								{isPrivate ?
									<ConfirmedButton
										confirmText="This will make all items visible to other Biscuits plan members"
										onConfirm={convertToShared}
									>
										Convert to shared list
									</ConfirmedButton>
								:	<ConfirmedButton
										confirmText="This will make this list inaccessible to other Biscuits plan members"
										onConfirm={convertToPrivate}
									>
										Convert to private list
									</ConfirmedButton>
								}
								<Button
									emphasis="primary"
									color="attention"
									onClick={deleteList}
								>
									Delete list
								</Button>
							</Box>
						</Box>
						<Dialog.Actions>
							<Dialog.Close />
						</Dialog.Actions>
					</Dialog.Content>
				</Dialog>
			</Box>
		</Box>
	);
}
