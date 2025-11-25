import { Button, ButtonProps, Icon, PwaInstallTrigger } from '@a-type/ui';

export function InstallButton(props: ButtonProps) {
	return (
		<PwaInstallTrigger asChild>
			<Button emphasis="ghost" size="small" {...props}>
				{props.children || (
					<>
						<Icon name="arrowDown" />
						<span>Install app</span>
					</>
				)}
			</Button>
		</PwaInstallTrigger>
	);
}
