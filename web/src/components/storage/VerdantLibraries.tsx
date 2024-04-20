import { graphql } from '@/graphql.js';
import {
  Avatar,
  AvatarList,
  AvatarListItem,
} from '@a-type/ui/components/avatar';
import { ConfirmedButton } from '@a-type/ui/components/button';
import {
  CardActions,
  CardFooter,
  CardGrid,
  CardMain,
  CardRoot,
  CardTitle,
} from '@a-type/ui/components/card';
import { AppId, AppManifest, apps, getAppUrl } from '@biscuits/apps';
import { useMutation, useSuspenseQuery } from '@biscuits/client';
import { Fragment } from 'react';

const libraryFragment = graphql(`
  fragment LibraryFragment on PlanLibraryInfo @_unmask {
    id
    replicas {
      id
      profile {
        id
        name
        imageUrl
      }
    }
  }
`);

const libraryData = graphql(
  `
    query VerdantLibraryData($appId: String!, $access: String!) {
      plan {
        id
        libraryInfo(app: $appId, access: $access) {
          ...LibraryFragment
        }
      }
    }
  `,
  [libraryFragment],
);

const resetSync = graphql(
  `
    mutation ResetSync($appId: String!, $access: String!) {
      resetSync(app: $appId, access: $access) {
        plan {
          id
          libraryInfo(app: $appId) {
            ...LibraryFragment
          }
        }
      }
    }
  `,
  [libraryFragment],
);

export function VerdantLibraries() {
  return (
    <CardGrid>
      {apps.map((appManifest) => (
        <Fragment key={appManifest.id}>
          <VerdantLibrary app={appManifest} access="members" />
          <VerdantLibrary app={appManifest} access="user" />
        </Fragment>
      ))}
    </CardGrid>
  );
}

function VerdantLibrary({
  app,
  access,
}: {
  app: AppManifest<AppId>;
  access: string;
}) {
  const data = useSuspenseQuery(libraryData, {
    variables: { appId: app.id, access },
  });
  const [doReset] = useMutation(resetSync);

  const info = data.data?.plan?.libraryInfo;
  if (!info)
    return (
      <CardRoot>
        <CardMain>
          <CardTitle className="flex flex-row gap-2 items-center">
            <img width={24} src={`${getAppUrl(app)}/${app.iconPath}`} />
            {app.name}
          </CardTitle>
          <p>No data</p>
        </CardMain>
      </CardRoot>
    );

  return (
    <CardRoot>
      <CardMain>
        <CardTitle className="flex flex-row gap-2 items-center">
          <img width={24} src={`${getAppUrl(app)}/${app.iconPath}`} />
          {app.name}
        </CardTitle>
        <AvatarList count={info.replicas.length}>
          {info.replicas.map((replica, index) => (
            <AvatarListItem
              index={index}
              key={replica.id}
              imageSrc={replica.profile.imageUrl ?? undefined}
              name={replica.profile.name}
            />
          ))}
        </AvatarList>
      </CardMain>
      <CardFooter>
        <CardActions>
          <ConfirmedButton
            onConfirm={() => doReset({ variables: { appId: app.id, access } })}
            size="small"
            color="destructive"
            confirmText="When you reset server data for this app, it will be re-initialized by the next device to open the app."
          >
            Reset server data
          </ConfirmedButton>
        </CardActions>
      </CardFooter>
    </CardRoot>
  );
}
