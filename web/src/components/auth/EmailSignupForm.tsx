// @unocss-include
import { Box, FormikForm, P, SubmitButton, TextField } from '@a-type/ui';
import { useState } from 'react';

export interface EmailSignupFormProps {
	returnTo?: string | null;
	actionText?: string;
	disabled?: boolean;
	endpoint: string;
	className?: string;
	appState?: any;
	onError?: (error: Error) => void;
	disableName?: boolean;
}

export function EmailSignupForm({
	returnTo,
	actionText = 'Verify email',
	disabled,
	endpoint,
	className,
	appState,
	onError,
	disableName = false,
	...rest
}: EmailSignupFormProps) {
	const [success, setSuccess] = useState(false);

	if (success) {
		return (
			<Box col gap="sm" className={className} {...rest}>
				<P emphasis="primary">Check your email for a verification link.</P>
			</Box>
		);
	}

	return (
		<FormikForm
			initialValues={{
				name: '',
				email: '',
			}}
			onSubmit={async (values) => {
				if (disabled) return;
				try {
					// this API accepts form data
					const formData = new FormData();
					if (!disableName) {
						formData.append('name', values.name);
					}
					formData.append('email', values.email);
					formData.append('returnTo', returnTo ?? '');
					if (appState) {
						formData.append('appState', JSON.stringify(appState));
					}
					const response = await fetch(endpoint, {
						method: 'post',
						body: formData,
						credentials: 'include',
					});
					if (response.ok) {
						setSuccess(true);
					}
				} catch (e) {
					onError?.(e as Error);
				}
			}}
			className={className}
			{...rest}
		>
			{!disableName && (
				<TextField
					name="name"
					label="Name"
					autoComplete="given-name"
					required
					className="w-full"
				/>
			)}
			<TextField
				name="email"
				type="email"
				label="Email"
				autoComplete="email"
				required
				className="w-full"
			/>
			<SubmitButton disabled={disabled} type="submit" emphasis="primary">
				{actionText}
			</SubmitButton>
		</FormikForm>
	);
}
