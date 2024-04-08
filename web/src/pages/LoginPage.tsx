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
import { lazy } from 'react';
import { Footer } from '@/components/help/Footer.jsx';

const Paws = lazy(() => import('@/components/paws/Paws.jsx'));

export default function LoginPage() {
  const [searchParams, setParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? undefined;
  const activeTab = searchParams.get('tab') ?? 'signin';

  return (
    <div className="flex flex-col items-center justify-center h-screen flex-1 bg-primary-wash">
      <div className="absolute top-0 left-0 w-full h-screen flex-[2]">
        <Paws />
      </div>
      <div className="flex flex-col gap-3 p-6 items-center bg-white border-solid border border-1 border-black rounded-lg relative z-1">
        <h1 className='[font-family:"VC_Henrietta_Trial","Noto_Serif",serif] mb-0'>
          Join the club
        </h1>
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
          <TabsContent
            value="signup"
            className="flex flex-col gap-3 items-stretch"
          >
            <P className="w-full text-center">Welcome!</P>
            <OAuthSignInButton
              provider="google"
              returnTo={returnTo}
              inviteId={searchParams.get('inviteId')}
              className="mx-auto"
            >
              Sign up with Google
            </OAuthSignInButton>
            <Or />
            <EmailSignUpForm returnTo={returnTo} />
          </TabsContent>
          <TabsContent
            value="signin"
            className="flex flex-col gap-3 items-stretch"
          >
            <P className="w-full text-center">Welcome back!</P>
            <OAuthSignInButton
              provider="google"
              returnTo={returnTo}
              inviteId={searchParams.get('inviteId')}
              className="mx-auto"
            >
              Sign in with Google
            </OAuthSignInButton>
            <Or />
            <EmailSignInForm returnTo={returnTo} />
          </TabsContent>
        </TabsRoot>
      </div>
      <Footer className="px-12" />
    </div>
  );
}

function Or() {
  return (
    <div className="flex flex-row gap-2 items-center">
      <div className="flex-1 border-t-solid border-t border-gray-5"></div>
      <p className="text-gray-5">or</p>
      <div className="flex-1 border-t-solid border-t border-gray-5"></div>
    </div>
  );
}
