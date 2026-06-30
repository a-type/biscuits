import cls from './GlobalLoader.module.css';

export function GlobalLoader() {
	return (
		<div className={cls.root}>
			<img src="/android-chrome-192x192.png" className={cls.logo} />
		</div>
	);
}
