import { Context, ComponentType, ReactNode } from "react";
import type {
  Client,
  ClientDescriptor,
  Schema,
  QueryStatus,
  UserInfo,
  ObjectEntity,
  ListEntity,
  Entity,
  AccessibleEntityProperty,
  EntityShape,
  AnyEntity,
  EntityDestructured,
  EntityFile,
  List,
  ListFilter,
  Trip,
  TripFilter,
} from "./index.js";

type HookConfig<F> = {
  index?: F;
  skip?: boolean;
  key?: string;
};

export interface GeneratedHooks<Presence, Profile> {
  /**
   * Render this context Provider at the top level of your
   * React tree to provide a Client to all hooks.
   */
  Provider: ComponentType<{
    value: ClientDescriptor<Schema>;
    children: ReactNode;
    sync?: boolean;
  }>;
  /**
   * Direct access to the React Context, if needed.
   */
  Context: Context<ClientDescriptor<Schema>>;
  /** @deprecated use useClient instead */
  useStorage: () => Client<Presence, Profile>;
  useClient: () => Client<Presence, Profile>;
  useUnsuspendedClient: () => Client<Presence, Profile> | null;
  useSelf: () => UserInfo<Profile, Presence>;
  usePeerIds: () => string[];
  usePeer: (peerId: string | null) => UserInfo<Profile, Presence> | null;
  useFindPeer: (
    query: (peer: UserInfo<Profile, Presence>) => boolean,
    options?: { includeSelf: boolean },
  ) => UserInfo<Profile, Presence> | null;
  useFindPeers: (
    query: (peer: UserInfo<Profile, Presence>) => boolean,
    options?: { includeSelf: boolean },
  ) => UserInfo<Profile, Presence>[];
  useSyncStatus: () => boolean;
  useWatch<T extends AnyEntity<any, any, any> | null>(
    entity: T,
  ): EntityDestructured<T>;
  useWatch<
    T extends AnyEntity<any, any, any> | null,
    P extends keyof EntityShape<T>,
  >(
    entity: T,
    prop: P,
  ): EntityDestructured<T>[P];
  useWatch<T extends EntityFile | null>(file: T): string | null;
  useUndo(): () => void;
  useRedo(): () => void;
  useCanUndo(): boolean;
  useCanRedo(): boolean;
  /**
   * This non-blocking hook declaratively controls sync on/off state.
   * Render it anywhere in your tree and pass it a boolean to turn sync on/off.
   * Since it doesn't trigger Suspense, you can do this in, say, a top-level
   * route component.
   *
   * It must still be rendered within your Provider.
   */
  useSync(isOn: boolean): void;

  useList(id: string, config?: { skip?: boolean }): List | null;
  useListUnsuspended(
    id: string,
    config?: { skip?: boolean },
  ): { data: List | null; status: QueryStatus };
  useOneList: <Config extends HookConfig<ListFilter>>(
    config?: Config,
  ) => List | null;
  useOneListsUnsuspended: <Config extends HookConfig<ListFilter>>(
    config?: Config,
  ) => { data: List | null; status: QueryStatus };
  useAllLists: <Config extends HookConfig<ListFilter>>(
    config?: Config,
  ) => List[];
  useAllListsUnsuspended: <Config extends HookConfig<ListFilter>>(
    config?: Config,
  ) => { data: List[]; status: QueryStatus };
  useAllListsPaginated: <
    Config extends HookConfig<ListFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    List[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
      status: QueryStatus;
    },
  ];
  useAllListsInfinite: <
    Config extends HookConfig<ListFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    List[],
    { loadMore: () => void; hasMore: boolean; status: QueryStatus },
  ];

  useTrip(id: string, config?: { skip?: boolean }): Trip | null;
  useTripUnsuspended(
    id: string,
    config?: { skip?: boolean },
  ): { data: Trip | null; status: QueryStatus };
  useOneTrip: <Config extends HookConfig<TripFilter>>(
    config?: Config,
  ) => Trip | null;
  useOneTripsUnsuspended: <Config extends HookConfig<TripFilter>>(
    config?: Config,
  ) => { data: Trip | null; status: QueryStatus };
  useAllTrips: <Config extends HookConfig<TripFilter>>(
    config?: Config,
  ) => Trip[];
  useAllTripsUnsuspended: <Config extends HookConfig<TripFilter>>(
    config?: Config,
  ) => { data: Trip[]; status: QueryStatus };
  useAllTripsPaginated: <
    Config extends HookConfig<TripFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    Trip[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
      status: QueryStatus;
    },
  ];
  useAllTripsInfinite: <
    Config extends HookConfig<TripFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    Trip[],
    { loadMore: () => void; hasMore: boolean; status: QueryStatus },
  ];
}

type HookName = `use${string}`;
type HookWithoutClient<
  Hook extends <TArgs extends any[], TRet>(
    client: Client,
    ...args: Targs
  ) => TRet,
> = (...args: TArgs) => TRet;
export function createHooks<
  Presence = any,
  Profile = any,
  Mutations extends {
    [N: HookName]: (client: Client<Presence, Profile>, ...args: any[]) => any;
  } = never,
>(
  mutations?: Mutations,
): GeneratedHooks<Presence, Profile> & {
  withMutations: <
    Mutations extends {
      [Name: HookName]: (
        client: Client<Presence, Profile>,
        ...args: any[]
      ) => unknown;
    },
  >(
    mutations: Mutations,
  ) => GeneratedHooks<Presence, Profile> & {
    [MutHook in keyof Mutations]: HookWithoutClient<Mutations[MutHook]>;
  };
};
