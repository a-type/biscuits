import { Box, BoxProps, Button, Icon, Input, clsx } from '@a-type/ui';

export interface CopyTextboxProps extends BoxProps {
	value: string;
	hideShare?: boolean;
}

export function CopyTextbox({
	value,
	className,
	hideShare,
	...rest
}: CopyTextboxProps) {
	const copy = () => {
		navigator.clipboard.writeText(value);
	};
	const share = () => {
		navigator.share({ url: value });
	};
	return (
		<Box
			d="row"
			gap="sm"
			items="center"
			className={clsx('w-full', className)}
			{...rest}
		>
			<Input disabled value={value} className="flex-[1_1_0]" />
			<Box d="row" gap="sm">
				<Button size="icon" onClick={copy}>
					<Icon name="copy" />
				</Button>
				{!hideShare && (
					<Button size="icon" onClick={share} color="primary">
						<Icon name="share" />
					</Button>
				)}
			</Box>
		</Box>
	);
}
