import { Box, clsx, Heading } from '@a-type/ui';
import { useAppInfo } from '../react.js';
import { AppIcon } from './AppIcon.js';
import cls from './NavLockup.module.css';

export interface NavLockupProps {
	showOnMobile?: boolean;
}

export function NavLockup({ showOnMobile }: NavLockupProps) {
	const app = useAppInfo();

	return (
		<Box
			gap="sm"
			layout="center"
			p="sm"
			className={cls.root}
			data-show-on-mobile={showOnMobile}
		>
			<AppIcon style={{ width: 30, height: 30 }} />
			<Heading
				render={<h1 />}
				emphasis="ambient"
				className={clsx('font-fancy @mode-denser', cls.title)}
			>
				{app.name}
			</Heading>
		</Box>
	);
}
