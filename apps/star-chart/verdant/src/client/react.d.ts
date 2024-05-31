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
  Project,
  ProjectFilter,
  Task,
  TaskFilter,
  Connection,
  ConnectionFilter,
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
    options?: { deep?: boolean },
  ): EntityDestructured<T>;
  useWatch<T extends EntityFile | null>(file: T): string | null;
  useOnChange<T extends AnyEntity<any, any, any> | null>(
    entity: T,
    callback: (info: {
      isLocal: boolean;
      target?: AnyEntity<any, any, any>;
    }) => void,
    options?: { deep?: boolean },
  ): void;
  useOnChange<T extends EntityFile | null>(file: T, callback: () => void): void;
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

  useProject(id: string, config?: { skip?: boolean }): Project | null;
  useProjectUnsuspended(
    id: string,
    config?: { skip?: boolean },
  ): { data: Project | null; status: QueryStatus };
  useOneProject: <Config extends HookConfig<ProjectFilter>>(
    config?: Config,
  ) => Project | null;
  useOneProjectsUnsuspended: <Config extends HookConfig<ProjectFilter>>(
    config?: Config,
  ) => { data: Project | null; status: QueryStatus };
  useAllProjects: <Config extends HookConfig<ProjectFilter>>(
    config?: Config,
  ) => Project[];
  useAllProjectsUnsuspended: <Config extends HookConfig<ProjectFilter>>(
    config?: Config,
  ) => { data: Project[]; status: QueryStatus };
  useAllProjectsPaginated: <
    Config extends HookConfig<ProjectFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    Project[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
      status: QueryStatus;
    },
  ];
  useAllProjectsInfinite: <
    Config extends HookConfig<ProjectFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    Project[],
    { loadMore: () => void; hasMore: boolean; status: QueryStatus },
  ];

  useTask(id: string, config?: { skip?: boolean }): Task | null;
  useTaskUnsuspended(
    id: string,
    config?: { skip?: boolean },
  ): { data: Task | null; status: QueryStatus };
  useOneTask: <Config extends HookConfig<TaskFilter>>(
    config?: Config,
  ) => Task | null;
  useOneTasksUnsuspended: <Config extends HookConfig<TaskFilter>>(
    config?: Config,
  ) => { data: Task | null; status: QueryStatus };
  useAllTasks: <Config extends HookConfig<TaskFilter>>(
    config?: Config,
  ) => Task[];
  useAllTasksUnsuspended: <Config extends HookConfig<TaskFilter>>(
    config?: Config,
  ) => { data: Task[]; status: QueryStatus };
  useAllTasksPaginated: <
    Config extends HookConfig<TaskFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    Task[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
      status: QueryStatus;
    },
  ];
  useAllTasksInfinite: <
    Config extends HookConfig<TaskFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    Task[],
    { loadMore: () => void; hasMore: boolean; status: QueryStatus },
  ];

  useConnection(id: string, config?: { skip?: boolean }): Connection | null;
  useConnectionUnsuspended(
    id: string,
    config?: { skip?: boolean },
  ): { data: Connection | null; status: QueryStatus };
  useOneConnection: <Config extends HookConfig<ConnectionFilter>>(
    config?: Config,
  ) => Connection | null;
  useOneConnectionsUnsuspended: <Config extends HookConfig<ConnectionFilter>>(
    config?: Config,
  ) => { data: Connection | null; status: QueryStatus };
  useAllConnections: <Config extends HookConfig<ConnectionFilter>>(
    config?: Config,
  ) => Connection[];
  useAllConnectionsUnsuspended: <Config extends HookConfig<ConnectionFilter>>(
    config?: Config,
  ) => { data: Connection[]; status: QueryStatus };
  useAllConnectionsPaginated: <
    Config extends HookConfig<ConnectionFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    Connection[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
      status: QueryStatus;
    },
  ];
  useAllConnectionsInfinite: <
    Config extends HookConfig<ConnectionFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    Connection[],
    { loadMore: () => void; hasMore: boolean; status: QueryStatus },
  ];
}

type HookName = `use${string}`;
type ArgsWithoutClient<T> = T extends (client: Client, ...args: infer U) => any
  ? U
  : never;
export function createHooks<
  Presence = any,
  Profile = any,
  Mutations extends {
    [N: HookName]: (client: Client<Presence, Profile>, ...args: any[]) => any;
  } = never,
>(options?: {
  Context?: Context<StorageDescriptor<Presence, Profile> | null>;
}): GeneratedHooks<Presence, Profile> & {
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
    [MutHook in keyof Mutations]: (
      ...args: ArgsWithoutClient<Mutations[MutHook]>
    ) => ReturnType<Mutations[MutHook]>;
  };
};
