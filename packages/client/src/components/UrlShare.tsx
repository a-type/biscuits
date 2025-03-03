import { Box, BoxProps, Button, Icon, Input, clsx } from '@a-type/ui';

export interface UrlShareProps extends BoxProps {
	value: string;
}

export function UrlShare({ value, className, ...rest }: UrlShareProps) {
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
				<Button size="icon" onClick={share} color="primary">
					<Icon name="placeholder" />
				</Button>
			</Box>
		</Box>
	);
}
