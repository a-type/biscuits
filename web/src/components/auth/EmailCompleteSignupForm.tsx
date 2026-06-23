import { Box, Button, FieldLabel, Input } from '@a-type/ui';

export interface EmailCompleteSignUpFormProps {
	code: string;
	email: string;
	endpoint: string;
	className?: string;
}

export function EmailCompleteSignupForm({
	code,
	email,
	endpoint,
	className,
	...rest
}: EmailCompleteSignUpFormProps) {
	return (
		<Box
			render={<form action={endpoint} method="post" />}
			col
			gap="sm"
			className={className}
			{...rest}
		>
			<input type="hidden" name="code" value={code} />
			<input type="hidden" name="email" value={email} />
			<FieldLabel htmlFor="password">Password</FieldLabel>
			<Input
				name="password"
				type="password"
				autoComplete="new-password"
				required
				className="w-full"
			/>
			<Button style={{ alignSelf: 'end' }} emphasis="primary" type="submit">
				Sign In
			</Button>
		</Box>
	);
}
