import { Box, Button, Input } from '@a-type/ui';

export interface ResetPasswordFormProps {
	code: string;
	email: string;
	endpoint: string;
	className?: string;
}

export function ResetPasswordForm({
	code,
	email,
	endpoint,
	className,
	...rest
}: ResetPasswordFormProps) {
	return (
		<Box
			col
			gap="sm"
			render={<form action={endpoint} method="post" />}
			className={className}
			{...rest}
		>
			<input type="hidden" name="code" value={code} />
			<input type="hidden" name="email" value={email} />
			<label htmlFor="newPassword" className="w-full">
				New Password
			</label>
			<Input
				name="newPassword"
				type="password"
				autoComplete="new-password"
				required
				className="w-full"
			/>
			<Button style={{ alignSelf: 'end' }} emphasis="primary" type="submit">
				Reset password
			</Button>
		</Box>
	);
}
