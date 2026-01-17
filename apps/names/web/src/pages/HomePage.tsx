import { SuperBarSuggestions } from '@/components/superBar/SuperBarSuggestions.jsx';
import {
	openTagManagement,
	TagManagement,
} from '@/components/tags/TagManagement.jsx';
import { Box, HideWhileKeyboardOpen, Icon } from '@a-type/ui';
import {
	AppIcon,
	InstallButton,
	UserMenu,
	UserMenuItem,
	UserMenuItemRightSlot,
} from '@biscuits/client/apps';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<>
			<Box
				items="center"
				justify="between"
				className="pb-sm"
				render={<HideWhileKeyboardOpen />}
			>
				<Box items="center" gap="sm">
					<AppIcon className="h-32px w-32px" />
					<h1 className="font-fancy m-0 p-0 text-md font-semibold">Names</h1>
				</Box>
				<Box items="center" gap="sm">
					<InstallButton />
					<UserMenu
						extraItems={
							<UserMenuItem onClick={openTagManagement}>
								Manage Tags
								<UserMenuItemRightSlot>
									<Icon name="tag" />
								</UserMenuItemRightSlot>
							</UserMenuItem>
						}
					/>
				</Box>
			</Box>
			<SuperBarSuggestions />
			<TagManagement />
		</>
	);
}

export default HomePage;
