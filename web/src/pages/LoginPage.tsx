import { P } from '@a-type/ui/components/typography';
import { useSearchParams } from '@verdant-web/react-router';
import {
  TabsList,
  TabsContent,
  TabsRoot,
  TabsTrigger,
} from '@a-type/ui/components/tabs';
import { lazy, useState } from 'react';
import { Footer } from '@/components/help/Footer.jsx';
import { Checkbox } from '@a-type/ui/components/checkbox';
import classNames from 'classnames';
import { CONFIG } from '@biscuits/client';
import {
  OAuthSigninButton,
  EmailSignupForm,
  EmailSigninForm,
} from '@a-type/auth-client';

const Paws = lazy(() => import('@/components/paws/Paws.jsx'));

export default function LoginPage() {
  const [searchParams, setParams] = useSearchParams();
  let returnTo = searchParams.get('returnTo') ?? undefined;
  const appReferrer = searchParams.get('appReferrer') ?? undefined;
  let appState: any = undefined;
  if (!returnTo && appReferrer) {
    appState = {
      appReferrer,
      appReturnTo: searchParams.get('appReturnTo') ?? undefined,
    };
  }

  const activeTab = searchParams.get('tab') ?? 'signin';

  const [tosAgreed, setTosAgreed] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen flex-1 bg-primary-wash">
      <div className="absolute top-0 left-0 w-full h-screen flex-[2]">
        <Paws />
      </div>
      <div className="flex flex-col gap-3 p-6 items-center bg-white border-solid border border-1 border-black rounded-lg relative z-1">
        <h1 className="font-fancy mb-0">Join the club</h1>
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
            <label
              className={classNames(
                'flex flex-row gap-3 max-w-400px text-sm transition-color  p-2 rounded-lg',
                !tosAgreed && 'bg-primary-light text-black',
              )}
            >
              <Checkbox
                checked={tosAgreed}
                onCheckedChange={(c) => setTosAgreed(!!c)}
              />
              <span>
                I agree to the{' '}
                <a href="/tos" className="font-bold" target="_blank">
                  terms of service
                </a>{' '}
                and have read the{' '}
                <a href="/privacy" className="font-bold" target="_blank">
                  privacy policy
                </a>
              </span>
            </label>
            <OAuthSigninButton
              endpoint={`${CONFIG.API_ORIGIN}/auth/provider/google/login`}
              returnTo={returnTo}
              inviteId={searchParams.get('inviteId')}
              className="mx-auto"
              disabled={!tosAgreed}
              appState={appState}
            >
              Sign up with Google
            </OAuthSigninButton>
            <Or />
            <EmailSignupForm
              endpoint={`${CONFIG.API_ORIGIN}/auth/begin-email-signup`}
              returnTo={returnTo}
              disabled={!tosAgreed}
              appState={appState}
            />
          </TabsContent>
          <TabsContent
            value="signin"
            className="flex flex-col gap-3 items-stretch"
          >
            <P className="w-full text-center">Welcome back!</P>
            <OAuthSigninButton
              endpoint={`${CONFIG.API_ORIGIN}/auth/provider/google/login`}
              returnTo={returnTo}
              inviteId={searchParams.get('inviteId')}
              className="mx-auto"
              appState={appState}
            >
              Sign in with Google
            </OAuthSigninButton>
            <Or />
            <EmailSigninForm
              returnTo={returnTo}
              endpoint={`${CONFIG.API_ORIGIN}/auth/email-login`}
              resetPasswordEndpoint={`${CONFIG.API_ORIGIN}/auth/begin-reset-password`}
              appState={appState}
            />
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
