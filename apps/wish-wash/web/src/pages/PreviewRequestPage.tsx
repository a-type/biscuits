import { PageContent, PageRoot } from '@a-type/ui';
import { WishlistOnboarding } from '@wish-wash.biscuits/common';

export interface PreviewRequestPageProps {}

export function PreviewRequestPage({}: PreviewRequestPageProps) {
	return (
		<PageRoot>
			<PageContent p="none" className="bg-primary-wash">
				<WishlistOnboarding
					onAnswers={() => {
						window.location.reload();
					}}
					thanksText="Thanks! That helps a lot!"
					style={{ flex: 1, padding: 'var(--m-sp-lg)' }}
				/>
			</PageContent>
		</PageRoot>
	);
}

export default PreviewRequestPage;
