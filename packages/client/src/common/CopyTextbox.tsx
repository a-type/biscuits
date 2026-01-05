import { Box, BoxProps, Button, Icon, Input, clsx } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';

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
	const isUrl = value.startsWith('http');
	const copy = () => {
		navigator.clipboard.writeText(value);
	};
	const share = () => {
		navigator.share(isUrl ? { url: value } : { text: value });
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
				<Button onClick={copy}>
					<Icon name="copy" />
				</Button>
				{isUrl && (
					<Button render={<Link className="color-inherit" newTab to={value} />}>
						<Icon name="new_window" />
					</Button>
				)}
				{!hideShare && (
					<Button onClick={share} emphasis="primary">
						<Icon name="share" />
					</Button>
				)}
			</Box>
		</Box>
	);
}
