import { EmailSigninForm } from '@/components/auth/EmailSigninForm.jsx';
import { EmailSignupForm } from '@/components/auth/EmailSignupForm.jsx';
import { OAuthSigninButton } from '@/components/auth/OAuthSigninButton.jsx';
import { Footer } from '@/components/help/Footer.jsx';
import {
	Box,
	Checkbox,
	Heading,
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
import cls from './LoginPage.module.css';

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
				<span className={cls.titleRow}>
					<img
						src={`${appInfo.url}/${appInfo.iconPath}`}
						className={cls.appLogo}
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
		<div className={cls.root}>
			<Box col gap grow layout="center center">
				<Box
					surface="ambient"
					elevated="sm"
					p
					gap
					col
					items="center"
					border
					className={cls.positioned}
				>
					<Heading className="font-fancy">{title}</Heading>
					{message && (
						<Box surface="secondary" className="@mode-accent @mode-dense">
							<P>{message}</P>
						</Box>
					)}
					{appReferrer && (
						<P emphasis="ambient" className={cls.referrerNote}>
							A Biscuits.club app
						</P>
					)}
					<TabsRoot
						className={cls.tabs}
						value={activeTab}
						onValueChange={(val) =>
							setParams((old) => {
								old.set('tab', val);
								return old;
							})
						}
					>
						<TabsList className={cls.tabsList}>
							<TabsTrigger value="signin">Log in</TabsTrigger>
							<TabsTrigger value="signup">Create account</TabsTrigger>
						</TabsList>
						<TabsContent value="signup" className={cls.tabContent}>
							<Box
								render={<label />}
								gap="lg"
								rounded
								p
								surface={tosAgreed ? 'ambient' : 'secondary'}
								className={classNames('@mode-dense', cls.toc)}
							>
								<Checkbox
									checked={tosAgreed}
									onCheckedChange={(c) => setTosAgreed(!!c)}
								/>
								<span>
									I agree to the{' '}
									<a href="/tos" className={cls.link} target="_blank">
										terms of service
									</a>{' '}
									and have read the{' '}
									<a href="/privacy" className={cls.link} target="_blank">
										privacy policy
									</a>
								</span>
							</Box>
							<OAuthSigninButton
								endpoint={`${CONFIG.API_ORIGIN}/auth/provider/google/login`}
								returnTo={returnTo || '/settings?tab=subscription'}
								inviteId={searchParams.get('inviteId')}
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
								<P className={cls.aside}>
									You must agree to the terms to sign up
								</P>
							)}
							<P className={cls.aside}>
								Your account works with{' '}
								<Link newTab to="/">
									all Biscuits apps
								</Link>
							</P>
						</TabsContent>
						<TabsContent value="signin" className={cls.tabContent}>
							<OAuthSigninButton
								endpoint={`${CONFIG.API_ORIGIN}/auth/provider/google/login`}
								returnTo={returnTo}
								inviteId={searchParams.get('inviteId')}
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
			<Box p="lg" full="width">
				<Footer />
			</Box>
		</div>
	);
}

function Or() {
	return (
		<Box items="center" gap="sm" d="row" full="width">
			<div className={cls.orBorder}></div>
			<div className={cls.or}>or</div>
			<div className={cls.orBorder}></div>
		</Box>
	);
}
