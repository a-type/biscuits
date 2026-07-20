import { AppIcon } from './AppIcon.js';
import cls from './GlobalLoader.module.css';

export function GlobalLoader() {
	return (
		<div className={cls.root}>
			<AppIcon className={cls.logo} />
		</div>
	);
}
