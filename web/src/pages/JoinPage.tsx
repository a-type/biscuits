import { EmailSignInForm } from '@/components/auth/EmailSignInForm';
import { EmailSignUpForm } from '@/components/auth/EmailSignupForm.jsx';
import { OAuthSignInButton } from '@/components/auth/OAuthSignInButton.jsx';
import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { H1, P } from '@a-type/ui/components/typography';
import { useSearchParams } from '@verdant-web/react-router';

export default function JoinPage() {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? undefined;

  return (
    <PageRoot>
      <PageContent>
        <H1>Join the club</H1>
        <div>
          <P>Lorem ipsum etc.</P>
          <OAuthSignInButton
            provider="google"
            returnTo={returnTo}
            inviteId={searchParams.get('inviteId')}
          >
            Sign up with Google
          </OAuthSignInButton>
          <EmailSignUpForm returnTo={returnTo} />
        </div>
        <div className="mt-8">
          <P>Already have an account?</P>
          <OAuthSignInButton
            provider="google"
            returnTo={returnTo}
            inviteId={searchParams.get('inviteId')}
          >
            Sign in with Google
          </OAuthSignInButton>
          <EmailSignInForm returnTo={returnTo} />
        </div>
      </PageContent>
    </PageRoot>
  );
}
