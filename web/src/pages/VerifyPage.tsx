import { EmailCompleteSignupForm } from '@/components/auth/EmailCompleteSignupForm';
import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { H1, P } from '@a-type/ui/components/typography';
import { useNavigate, useSearchParams } from '@verdant-web/react-router';

export interface VerifyPageProps {}

export function VerifyPage({}: VerifyPageProps) {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const code = searchParams.get('code');
  const email = searchParams.get('email');

  const navigate = useNavigate();
  const onSuccess = () => {
    if (returnTo) {
      navigate(returnTo);
    } else {
      navigate('/');
    }
  };

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
          onSuccess={onSuccess}
        />
      </PageContent>
    </PageRoot>
  );
}

export default VerifyPage;
