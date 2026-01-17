import { apps } from '@biscuits/apps';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'uno.css';

function main() {
	const root = createRoot(document.getElementById('root')!);
	root.render(
		<StrictMode>
			<AppIcons />
		</StrictMode>,
	);
}

function AppIcons() {
	const search = new URLSearchParams(window.location.search);
	const hostApp = search.get('hostApp');

	const goTo = (id: string) => {
		window.parent.postMessage(
			{ type: 'navigate', payload: { appId: id } },
			'*',
		);
	};

	return (
		<div
			className="grid grid-cols-2 h-auto gap-4 p-4"
			style={{
				width: 40 * 2 + 16 + 32,
			}}
		>
			{apps
				.filter((app) => app.id !== hostApp && !app.prerelease)
				.map((app) => {
					const iconUrl = new URL(
						import.meta.env.DEV ? app.devOriginOverride : app.url,
					);
					iconUrl.pathname = app.iconPath;
					return (
						<button
							key={app.id}
							className="h-auto w-auto flex cursor-pointer appearance-none rounded border-none p-0 bg-gray-light"
							onClick={() => goTo(app.id)}
						>
							<img
								src={iconUrl.toString()}
								alt={app.name}
								className="block h-[40px] w-[40px]"
							/>
						</button>
					);
				})}
		</div>
	);
}

main();
