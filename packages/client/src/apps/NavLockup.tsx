import { Box, clsx, Heading } from '@a-type/ui';
import { useAppInfo } from '../react.js';
import { AppIcon } from './AppIcon.js';
import cls from './NavLockup.module.css';

export interface NavLockupProps {}

export function NavLockup({}: NavLockupProps) {
	const app = useAppInfo();

	return (
		<Box gap="sm" layout="center" p="sm" className={cls.root}>
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
