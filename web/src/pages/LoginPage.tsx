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
    <div className="flex flex-col items-center justify-center h-screen flex-1 bg-primary">
      <div className="absolute top-0 left-0 w-full h-screen flex-[2]">
        <Paws />
      </div>
      <div className="flex flex-col gap-3 p-6 items-center bg-primary-light border-solid border border-3 border-primary-dark rounded-lg relative z-1">
        <H1 className='[font-family:"VC_Henrietta_Trial","Noto_Serif",serif]'>
          Join the club
        </H1>
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
    </div>
  );
}
