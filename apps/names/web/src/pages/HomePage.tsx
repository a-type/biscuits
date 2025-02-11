import { SuperBarSuggestions } from '@/components/superBar/SuperBarSuggestions.jsx';
import {
	TagManagement,
	TagManagementTrigger,
} from '@/components/tags/TagManagement.jsx';
import { Box, HideWhileKeyboardOpen, Icon } from '@a-type/ui';
import {
	AppIcon,
	InstallButton,
	UserMenu,
	UserMenuItem,
	UserMenuItemRightSlot,
} from '@biscuits/client';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<>
			<Box items="center" justify="between" className="pb-sm" asChild>
				<HideWhileKeyboardOpen>
					<Box items="center" gap="sm">
						<AppIcon className="w-32px h-32px" />
						<h1 className="font-fancy m-0 text-md font-semibold p-0">Names</h1>
					</Box>
					<Box items="center" gap="sm">
						<InstallButton />
						<UserMenu
							extraItems={
								<TagManagementTrigger>
									<UserMenuItem>
										Manage Tags
										<UserMenuItemRightSlot>
											<Icon name="tag" />
										</UserMenuItemRightSlot>
									</UserMenuItem>
								</TagManagementTrigger>
							}
						/>
					</Box>
				</HideWhileKeyboardOpen>
			</Box>
			<SuperBarSuggestions />
			<TagManagement />
		</>
	);
}

export default HomePage;
