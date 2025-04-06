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
			className="grid grid-cols-2 gap-4 h-auto p-4"
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
							className="bg-gray-light rounded p-0 w-auto h-auto flex appearance-none border-none cursor-pointer"
							onClick={() => goTo(app.id)}
						>
							<img
								src={iconUrl.toString()}
								alt={app.name}
								className="w-[40px] h-[40px] block"
							/>
						</button>
					);
				})}
		</div>
	);
}

main();
