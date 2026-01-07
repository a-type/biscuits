import { Button, ButtonProps, Icon } from '@a-type/ui';
import { useLocalStorage } from '@biscuits/client';
import { useRegisterSW } from 'virtual:pwa-register/react';

export interface ReloadButtonProps extends ButtonProps {}

export function ReloadButton({ onClick, ...props }: ReloadButtonProps) {
	const { updateServiceWorker } = useRegisterSW();
	const [_, setLastErrorReload] = useLastErrorReload();

	const refresh = () => {
		setLastErrorReload(Date.now() + 500);
		updateServiceWorker();
		window.location.reload();
	};

	return (
		<Button
			{...props}
			onClick={(ev) => {
				onClick?.(ev);
				refresh();
			}}
		>
			<Icon name="refresh" />
			<span>Refresh</span>
		</Button>
	);
}

function useLastErrorReload() {
	return useLocalStorage('lastErrorReload', 0);
}

export function useHadRecentError() {
	const [lastErrorReload] = useLocalStorage('lastErrorReload', 0);

	const hadRecentError =
		lastErrorReload < Date.now() &&
		lastErrorReload > Date.now() - 1000 * 60 * 60;

	return hadRecentError;
}
