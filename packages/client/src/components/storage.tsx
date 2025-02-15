import {
	Button,
	ButtonProps,
	clsx,
	ConfirmedButton,
	H2,
	Icon,
	P,
	toast,
} from '@a-type/ui';
import { appsById } from '@biscuits/apps';
import { useContext, useState } from 'react';
import { useHasServerAccess } from '../hooks/graphql.js';
import { VerdantContext } from '../verdant.js';
import { useAppId } from './Context.js';

export interface ExportDataButtonProps extends Omit<ButtonProps, 'onError'> {
	onError: (error: Error) => void;
}

export function ExportDataButton({
	children,
	onError,
	...props
}: ExportDataButtonProps) {
	const [loading, setLoading] = useState(false);
	const clientDesc = useContext(VerdantContext);
	const appId = useAppId();
	const app = appsById[appId];
	if (!clientDesc) return null;
	return (
		<Button
			onClick={async () => {
				setLoading(true);
				try {
					const backup = await import('@verdant-web/store/backup');
					const client = await clientDesc.open();
					const file = await backup.createClientBackup(client);
					const url = URL.createObjectURL(file);
					const a = document.createElement('a');
					a.href = url;
					a.download = `${app.name}-backup-${new Date().toISOString()}.zip`;
					a.click();
				} catch (e) {
					console.error(e);
					onError(e as Error);
				} finally {
					setLoading(false);
				}
			}}
			loading={loading}
			{...props}
		>
			{children || (
				<>
					Export Data <Icon name="download" />
				</>
			)}
		</Button>
	);
}

export function ImportDataButton({
	children,
	onError,
	...props
}: ExportDataButtonProps) {
	const [loading, setLoading] = useState(false);
	const clientDesc = useContext(VerdantContext);
	if (!clientDesc) return null;
	return (
		<Button asChild loading={loading} {...props}>
			<label>
				<input
					type="file"
					hidden
					accept=".zip"
					onChange={async (ev) => {
						setLoading(true);
						try {
							const backup = await import('@verdant-web/store/backup');
							const client = await clientDesc.open();
							const file = ev.target.files?.[0];
							if (!file) {
								throw new Error('No file selected');
							}
							await backup.importClientBackup(client, file);
							window.location.reload();
						} catch (e) {
							console.error(e);
							onError(e as Error);
						} finally {
							setLoading(false);
						}
					}}
				></input>
				{children || (
					<>
						Import Data <Icon name="upload" />
					</>
				)}
			</label>
		</Button>
	);
}

export interface ManageStorageProps {
	className?: string;
	onError?: (error: Error) => void;
}

function defaultOnError(error: Error) {
	toast.error(error.message);
}
export function ManageStorage({
	className,
	onError = defaultOnError,
}: ManageStorageProps) {
	const isSubscribed = useHasServerAccess();
	const clientDesc = useContext(VerdantContext);

	// sync users cannot manage local storage, it would cause unexpected
	// results...
	if (isSubscribed) {
		return (
			<div className={clsx('flex flex-col items-start gap-2', className)}>
				<H2>Manage Device Storage</H2>
				<P className="text-xs mb-2">
					Your data is synced to Biscuits. If you're experiencing issues, you
					can try resetting your local device to the server's data.
				</P>
				<div className="flex flex-row gap-2 flex-wrap">
					<ConfirmedButton
						color="destructive"
						confirmText="This will delete your local data and replace it with the server's data. It cannot be undone."
						onConfirm={() => {
							clientDesc?.__dangerous__resetLocal();
						}}
					>
						Reset local data
					</ConfirmedButton>
				</div>
			</div>
		);
	}

	return (
		<div className={clsx('flex flex-col items-start gap-2', className)}>
			<H2>Manage App Storage</H2>
			<P className="text-xs mb-2">
				This app stores all data on your device. You can export and import your
				data, or reset it.
			</P>
			<div className="flex flex-row gap-2 flex-wrap">
				<ExportDataButton onError={onError} />
				<ImportDataButton onError={onError} />
				<ConfirmedButton
					color="destructive"
					confirmText="This will delete your data. It cannot be undone."
					onConfirm={() => {
						clientDesc?.__dangerous__resetLocal();
					}}
				>
					Reset data
				</ConfirmedButton>
			</div>
		</div>
	);
}
