import { Heading, PageContent, PageRoot } from '@a-type/ui';
import { AppId, appsById } from '@biscuits/apps';
import { useSearchParams } from '@verdant-web/react-router';

export interface BackToAppPageProps {}

export function BackToAppPage({}: BackToAppPageProps) {
	const [search] = useSearchParams();
	const appId = search.get('appId') as AppId;
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
