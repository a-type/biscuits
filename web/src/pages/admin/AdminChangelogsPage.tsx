import { AppChangelogEditor } from '@/components/admin/AppChangelogEditor.jsx';
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@a-type/ui/components/tabs';
import { apps } from '@biscuits/apps';
import { Suspense, useState } from 'react';

export function AdminChangelogsPage() {
  const [val, setVal] = useState(apps[0].id);
  return (
    <div className="col">
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
    </div>
  );
}

export default AdminChangelogsPage;
