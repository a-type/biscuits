import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { WishlistOnboarding } from '@wish-wash.biscuits/common';

export interface PreviewRequestPageProps {}

export function PreviewRequestPage({}: PreviewRequestPageProps) {
	return (
		<PageRoot>
			<PageContent noPadding fullHeight className="bg-primary-wash">
				<WishlistOnboarding
					onAnswers={() => {
						window.location.reload();
					}}
					thanksText="Thanks! That helps a lot!"
					className="flex-1 p-4"
				/>
			</PageContent>
		</PageRoot>
	);
}

export default PreviewRequestPage;
