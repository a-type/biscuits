import { Heading, PageContent, PageRoot } from '@a-type/ui';
import { AppId, appsById } from '@biscuits/apps';
import { useSearch } from '@tanstack/react-router';

export interface BackToAppPageProps {}

export function BackToAppPage({}: BackToAppPageProps) {
	const search = useSearch({ strict: false }) as Record<string, string>;
	const appId = search.appId as AppId;
	const app = appId ? appsById[appId] : null;
	return (
		<PageRoot>
			<PageContent>
				<Heading emphasis="primary">
					Returning to {app?.name ?? 'app'}...
				</Heading>
			</PageContent>
		</PageRoot>
	);
}

export default BackToAppPage;
