import { ResetPasswordForm } from '@a-type/auth-client';
import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { H1, P } from '@a-type/ui/components/typography';
import { CONFIG } from '@biscuits/client';
import { useSearchParams } from '@verdant-web/react-router';

export interface ResetPasswordPageProps {}

export function ResetPasswordPage({}: ResetPasswordPageProps) {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const email = searchParams.get('email');

  if (!code || !email) {
    return (
      <PageRoot>
        <PageContent>
          <H1>Invalid password reset link</H1>
          <P>Try resetting your password again.</P>
        </PageContent>
      </PageRoot>
    );
  }

  return (
    <PageRoot>
      <PageContent>
        <H1>Complete your signup</H1>
        <ResetPasswordForm
          code={code}
          email={email}
          endpoint={`${CONFIG.API_ORIGIN}/auth/complete-reset-password`}
        />
      </PageContent>
    </PageRoot>
  );
}

export default ResetPasswordPage;
