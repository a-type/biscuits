import { Footer } from '@/components/help/Footer.jsx';
import {
	EmailSigninForm,
	EmailSignupForm,
	OAuthSigninButton,
} from '@a-type/auth-ui';
import {
	Box,
	Checkbox,
	P,
	TabsContent,
	TabsList,
	TabsRoot,
	TabsTrigger,
	toast,
} from '@a-type/ui';
import { AppId, appsById } from '@biscuits/apps';
import { CONFIG } from '@biscuits/client';
import { Link, useSearchParams } from '@verdant-web/react-router';
import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';

export default function LoginPage() {
	const [searchParams, setParams] = useSearchParams();
	const returnTo = searchParams.get('returnTo') ?? undefined;
	const appReferrer = searchParams.get('appReferrer') ?? undefined;
	let appState: any = undefined;
	if (!returnTo && appReferrer) {
		appState = {
			appReferrer,
			appReturnTo: searchParams.get('appReturnTo') ?? undefined,
		};
	}
	const error = searchParams.get('error');
	useEffect(() => {
		if (error) {
			toast.error(error, { id: error });
		}
	}, [error]);

	const activeTab = searchParams.get('tab') ?? 'signin';
	const message = searchParams.get('message');

	const [tosAgreed, setTosAgreed] = useState(false);

	let title: ReactNode = activeTab === 'signin' ? 'Log in' : 'Join the club';
	if (appReferrer) {
		const appInfo = appsById[appReferrer as AppId];
		if (appInfo) {
			title = (
				<span className="row">
					<img
						src={`${appInfo.url}/${appInfo.iconPath}`}
						className="mr-2 inline-block h-60px w-60px"
						alt=""
					/>
					{activeTab === 'signin' ?
						`Log in to ${appInfo.name}`
					:	`Sign up for ${appInfo.name}`}
				</span>
			);
		}
	}

	return (
		<div className="h-screen flex flex-1 flex-col items-center justify-center bg-primary-wash">
			<Box d="col" gap grow layout="center center">
				<Box
					surface="white"
					elevated="sm"
					p
					container="reset"
					d="col"
					items="center"
					border
					className="relative z-1"
				>
					<h1 className="font-fancy mb-0">{title}</h1>
					{message && (
						<P className="rounded-full px-3 py-1 bg-accent-light">{message}</P>
					)}
					{appReferrer && (
						<P className="text-sm italic color-gray-dark">
							A Biscuits.club app
						</P>
					)}
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
							className="flex flex-col items-stretch gap-md"
						>
							<label
								className={classNames(
									'max-w-400px flex flex-row gap-3 rounded-lg p-2 text-sm transition-color',
									!tosAgreed && 'color-black bg-primary-light',
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
								returnTo={returnTo || '/settings?tab=subscription'}
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
								returnTo={returnTo || '/settings?tab=subscription'}
								disabled={!tosAgreed}
								appState={appState}
							/>
							{!tosAgreed && (
								<P className="text-center text-sm color-gray-dark">
									You must agree to the terms to sign up
								</P>
							)}
							{appReferrer && (
								<P className="text-center text-sm color-gray-dark">
									Your account works with{' '}
									<Link newTab to="/">
										all Biscuits apps
									</Link>
								</P>
							)}
						</TabsContent>
						<TabsContent
							value="signin"
							className="flex flex-col items-stretch gap-md"
						>
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
				</Box>
			</Box>
			<Footer className="px-12" />
		</div>
	);
}

function Or() {
	return (
		<div className="flex flex-row items-center gap-2">
			<div className="flex-1 border-t border-t-solid border-gray-dark"></div>
			<div className="color-gray-dark">or</div>
			<div className="flex-1 border-t border-t-solid border-gray-dark"></div>
		</div>
	);
}
