import { SuperBarSuggestions } from '@/components/superBar/SuperBarSuggestions.jsx';
import {
	openTagManagement,
	TagManagement,
} from '@/components/tags/TagManagement.jsx';
import { Box, HideWhileKeyboardOpen, Icon } from '@a-type/ui';
import {
	InstallButton,
	NavLockup,
	UserMenu,
	UserMenuItem,
	UserMenuItemRightSlot,
} from '@biscuits/client/apps';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<>
			<Box items="center" justify="between" render={<HideWhileKeyboardOpen />}>
				<NavLockup showOnMobile />
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
