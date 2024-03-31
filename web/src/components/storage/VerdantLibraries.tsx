import { graphql } from '@/graphql.js';
import { Avatar, AvatarList } from '@a-type/ui/components/avatar';
import { ConfirmedButton } from '@a-type/ui/components/button';
import {
  CardActions,
  CardFooter,
  CardGrid,
  CardMain,
  CardRoot,
  CardTitle,
} from '@a-type/ui/components/card';
import { AppId, AppManifest, apps } from '@biscuits/apps';
import { useMutation, useSuspenseQuery } from '@biscuits/client';

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
    query VerdantLibraryData($appId: String!) {
      plan {
        libraryInfo(app: $appId) {
          ...LibraryFragment
        }
      }
    }
  `,
  [libraryFragment],
);

const resetSync = graphql(
  `
    mutation ResetSync($appId: String!) {
      resetSync(app: $appId) {
        plan {
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
        <VerdantLibrary app={appManifest} key={appManifest.id} />
      ))}
    </CardGrid>
  );
}

function VerdantLibrary({ app }: { app: AppManifest<AppId> }) {
  const data = useSuspenseQuery(libraryData, { variables: { appId: app.id } });
  const [doReset] = useMutation(resetSync);

  const info = data.data?.plan?.libraryInfo;
  if (!info)
    return (
      <CardRoot>
        <CardMain>
          <CardTitle>{app.name}</CardTitle>
          <p>No data</p>
        </CardMain>
      </CardRoot>
    );

  return (
    <CardRoot>
      <CardMain>
        <CardTitle>{app.name}</CardTitle>
        <AvatarList count={info.replicas.length}>
          {info.replicas.map((replica) => (
            <Avatar
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
            onConfirm={() => doReset({ variables: { appId: app.id } })}
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
