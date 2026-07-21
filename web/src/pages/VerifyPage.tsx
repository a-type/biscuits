import { CONFIG } from '@biscuits/client';
import { EmailCompleteSignupForm } from '@/components/auth/EmailCompleteSignupForm.jsx';
import { H1, P, PageContent, PageRoot } from '@a-type/ui';
import { useSearch } from '@tanstack/react-router';

export interface VerifyPageProps {}

export function VerifyPage({}: VerifyPageProps) {
	const search = useSearch({ strict: false }) as Record<string, string>;
	const code = search.code;
	const email = search.email;

	if (!code || !email) {
		return (
			<PageRoot>
				<PageContent>
					<H1>Invalid verification link</H1>
					<P>Try signing up again.</P>
				</PageContent>
			</PageRoot>
		);
	}

	return (
		<PageRoot>
			<PageContent>
				<H1>Complete your signup</H1>
				<EmailCompleteSignupForm
					code={code}
					email={email}
					endpoint={`${CONFIG.API_ORIGIN}/auth/complete-email-signup`}
				/>
			</PageContent>
		</PageRoot>
	);
}

export default VerifyPage;
