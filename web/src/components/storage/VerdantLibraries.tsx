import {
	AvatarList,
	AvatarListItem,
	CardActions,
	CardContent,
	CardFooter,
	CardGrid,
	CardMain,
	CardRoot,
	CardTitle,
	ConfirmedButton,
} from '@a-type/ui';
import { AppId, AppManifest, apps, getAppUrl } from '@biscuits/apps';
import { graphql, useMutation, useSuspenseQuery } from '@biscuits/graphql';
import { Fragment } from 'react';

const libraryFragment = graphql(`
	fragment LibraryFragment on PlanLibraryInfo @_unmask {
		id
		profiles {
			id
			name
			imageUrl
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
					libraryInfo(app: $appId, access: $access) {
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

	if (!info) {
		return null;
	}

	return (
		<CardRoot>
			<CardMain>
				<CardTitle className="flex flex-row gap-2 items-center">
					<img width={24} src={`${getAppUrl(app)}/${app.iconPath}`} />
					{app.name}
					{access === 'user' && <span> (private data)</span>}
				</CardTitle>
				<CardContent>
					<AvatarList count={info.profiles.length}>
						{info.profiles.map((profile, index) => (
							<AvatarListItem
								index={index}
								key={profile.id}
								imageSrc={profile.imageUrl ?? undefined}
								name={profile.name}
							/>
						))}
					</AvatarList>
				</CardContent>
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
