import { EmailSignInForm } from '@/components/auth/EmailSignInForm.jsx';
import { EmailSignUpForm } from '@/components/auth/EmailSignupForm.jsx';
import { OAuthSignInButton } from '@/components/auth/OAuthSignInButton.jsx';
import { H1, P } from '@a-type/ui/components/typography';
import { useSearchParams } from '@verdant-web/react-router';
import {
  TabsList,
  TabsContent,
  TabsRoot,
  TabsTrigger,
} from '@a-type/ui/components/tabs';
import Paws from '@/components/Paws.jsx';

export default function LoginPage() {
  const [searchParams, setParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? undefined;
  const activeTab = searchParams.get('tab') ?? 'signin';

  return (
    <div className="flex flex-row items-stretch justify-stretch h-full flex-1">
      <div className="flex flex-col gap-3 flex-1 p-4 items-center bg-primary-light border-r-solid border-r border-r-3 border-r-primary-dark">
        <H1>Join the club</H1>
        <TabsRoot
          className="flex flex-col"
          value={activeTab}
          onValueChange={(val) =>
            setParams((old) => {
              old.set('tab', val);
              return old;
            })
          }
        >
          <TabsList className="mb-4">
            <TabsTrigger value="signin">Log in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>
          <TabsContent value="signup" className="flex flex-col gap-3">
            <P>Welcome!</P>
            <OAuthSignInButton
              provider="google"
              returnTo={returnTo}
              inviteId={searchParams.get('inviteId')}
            >
              Sign up with Google
            </OAuthSignInButton>
            <EmailSignUpForm returnTo={returnTo} />
          </TabsContent>
          <TabsContent value="signin" className="flex flex-col gap-3">
            <P>Welcome back!</P>
            <OAuthSignInButton
              provider="google"
              returnTo={returnTo}
              inviteId={searchParams.get('inviteId')}
            >
              Sign in with Google
            </OAuthSignInButton>
            <EmailSignInForm returnTo={returnTo} />
          </TabsContent>
        </TabsRoot>
      </div>
      <div className="hidden lg:block relative bg-primary w-full h-screen flex-[2]">
        <Paws />
      </div>
    </div>
  );
}
