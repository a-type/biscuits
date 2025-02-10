import { SuperBarSuggestions } from '@/components/superBar/SuperBarSuggestions.jsx';
import { Box, HideWhileKeyboardOpen } from '@a-type/ui';
import { AppIcon, UserMenu } from '@biscuits/client';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<>
			<Box items="center" justify="between" className="pb-sm">
				<HideWhileKeyboardOpen>
					<Box items="center" gap="sm">
						<AppIcon className="w-32px h-32px" />
						<h1 className="font-fancy m-0 text-md font-semibold p-0">Names</h1>
					</Box>
				</HideWhileKeyboardOpen>
				<UserMenu />
			</Box>
			<SuperBarSuggestions />
		</>
	);
}

export default HomePage;
