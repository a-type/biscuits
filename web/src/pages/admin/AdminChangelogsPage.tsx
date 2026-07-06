import { AppChangelogEditor } from '@/components/admin/AppChangelogEditor.jsx';
import { Box, TabsContent, TabsList, TabsRoot, TabsTrigger } from '@a-type/ui';
import { apps } from '@biscuits/apps';
import { Suspense, useState } from 'react';

export function AdminChangelogsPage() {
	const [val, setVal] = useState<string>(apps[0].id);
	return (
		<Box col>
			<TabsRoot value={val} onValueChange={setVal}>
				<TabsList>
					{apps.map((app) => (
						<TabsTrigger key={app.id} value={app.id}>
							{app.name}
						</TabsTrigger>
					))}
				</TabsList>
				{apps.map((app) => (
					<TabsContent value={app.id} key={app.id}>
						<Suspense>
							<AppChangelogEditor appId={app.id} />
						</Suspense>
					</TabsContent>
				))}
			</TabsRoot>
		</Box>
	);
}

export default AdminChangelogsPage;
