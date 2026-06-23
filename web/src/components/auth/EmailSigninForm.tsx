import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
	FieldLabel,
	FormikForm,
	Input,
	P,
	TextField,
	toast,
} from '@a-type/ui';
import { useState } from 'react';
import cls from './EmailSigninForm.module.css';

export interface EmailSigninFormProps {
	returnTo?: string;
	endpoint: string;
	resetPasswordEndpoint: string;
	className?: string;
	appState?: any;
}

export function EmailSigninForm({
	returnTo = '',
	endpoint,
	resetPasswordEndpoint,
	className,
	appState,
	...rest
}: EmailSigninFormProps) {
	const url = new URL(endpoint);
	if (returnTo) {
		url.searchParams.append('returnTo', returnTo);
	}
	if (appState) {
		url.searchParams.append('appState', JSON.stringify(appState));
	}

	return (
		<Box
			col
			gap="sm"
			items="stretch"
			render={<form method="post" action={url.toString()} />}
			className={className}
			{...rest}
		>
			<FieldLabel htmlFor="email">Email</FieldLabel>
			<Input name="email" autoComplete="email" required className="w-full" />
			<FieldLabel htmlFor="password">Password</FieldLabel>
			<Input
				autoComplete="current-password"
				name="password"
				type="password"
				required
				className="w-full"
			/>
			<input type="hidden" name="csrfToken" value={appState?.csrfToken || ''} />
			<input type="hidden" name="returnTo" value={returnTo} />
			<input type="hidden" name="appState" value={JSON.stringify(appState)} />
			<Button type="submit" style={{ alignSelf: 'end' }} emphasis="primary">
				Sign In
			</Button>
			<ForgotPassword endpoint={resetPasswordEndpoint} />
		</Box>
	);
}

function ForgotPassword({
	className,
	endpoint,
}: {
	className?: string;
	endpoint: string;
}) {
	const [open, setOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				className={className}
				render={<button className={cls.forgotPassword} />}
			>
				Forgot password?
			</DialogTrigger>
			<DialogContent>
				<FormikForm
					initialValues={{
						email: '',
					}}
					onSubmit={async (values, _helpers) => {
						try {
							const formData = new FormData();
							formData.append('email', values.email);
							let returnTo = window.location.pathname;
							if (window.location.search) {
								returnTo += window.location.search;
							}
							formData.append('returnTo', returnTo);
							const response = await fetch(endpoint, {
								method: 'post',
								body: formData,
							});
							if (response.ok) {
								setOpen(false);
								toast.success('Reset email sent. Check your inbox.');
							} else {
								setErrorMessage('Failed to send reset email. Try again?');
							}
						} catch (err) {
							console.error(err);
							setErrorMessage('Failed to send reset email. Try again?');
						}
					}}
				>
					<TextField label="Email" name="email" type="email" required />
					{errorMessage && (
						<Box surface="secondary" className="@mode-attention">
							<P>{errorMessage}</P>
						</Box>
					)}
					<DialogActions>
						<DialogClose>Cancel</DialogClose>
						<Button color="primary" type="submit" style={{ alignSelf: 'end' }}>
							Send reset email
						</Button>
					</DialogActions>
				</FormikForm>
			</DialogContent>
		</Dialog>
	);
}
