import {
  Context,
  ComponentType,
  ReactNode,
  ChangeEvent,
  FocusEvent,
} from "react";
import type {
  Client,
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
  EntityInit,
  EntityFile,
  Floor,
  FloorFilter,
} from "./index.js";

type HookConfig<F> = {
  index?: F;
  skip?: boolean;
  key?: string;
};

type FieldInputProps<Shape> = {
  value: Shape extends boolean ? undefined : Shape;
  checked?: boolean;
  onChange: (event: ChangeEvent) => void;
  onFocus: (event: FocusEvent) => void;
  onBlur: (event: FocusEvent) => void;
  type?: string;
};

export interface GeneratedHooks<Presence, Profile> {
  /**
   * Render this context Provider at the top level of your
   * React tree to provide a Client to all hooks.
   */
  Provider: ComponentType<{
    value: Client<any, any>;
    children: ReactNode;
    sync?: boolean;
  }>;
  /**
   * Direct access to the React Context, if needed.
   */
  Context: Context<Client<any, any>>;
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
  useViewPeers: () => UserInfo<Profile, Presence>[];
  useViewId: (viewId: string | undefined) => void;
  useField<
    T extends AnyEntity<any, any, any>,
    K extends keyof EntityDestructured<T>,
  >(
    entity: T,
    fieldName: K,
    options?: {
      /** after this timeout, the field will be considered abandoned by a peer. defaults to 1m */
      timeout: number;
    },
  ): {
    /* The live value of the field */
    value: EntityDestructured<T>[K];
    /* Sets the value of the field */
    setValue: (value: Exclude<EntityInit<T>[K], undefined>) => void;
    /* Pass these props to any <input> or <textarea> element to auto-wire it */
    inputProps: FieldInputProps<EntityDestructured<T>[K]>;
    presence: {
      /**
       * Whether the current replica is editing the field
       */
      self: boolean;
      /**
       * A list of peers editing this field
       */
      peers: UserInfo<Profile, Presence>[];
      /**
       * Whether the field is currently being edited by someone else.
       * Will return false if the current replica is already editing it.
       */
      occupied: boolean;
      /**
       * Mark the field as being edited by the current replica, similar to
       * what inputProps do on 'focus' events.
       */
      touch: () => void;
    };
  };
  useSyncStatus: () => boolean;
  useWatch<T extends AnyEntity<any, any, any> | null>(
    entity: T,
    options?: {
      /** Observes changes to all sub-objects */
      deep?: boolean;
      /** Disables performance enhancements that prevent re-renders if the changed keys aren't used in the component */
      untracked?: boolean;
    },
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

  useFloor(id: string, config?: { skip?: boolean }): Floor | null;
  useFloorUnsuspended(
    id: string,
    config?: { skip?: boolean },
  ): { data: Floor | null; status: QueryStatus };
  useOneFloor: <Config extends HookConfig<FloorFilter>>(
    config?: Config,
  ) => Floor | null;
  useOneFloorsUnsuspended: <Config extends HookConfig<FloorFilter>>(
    config?: Config,
  ) => { data: Floor | null; status: QueryStatus };
  useAllFloors: <Config extends HookConfig<FloorFilter>>(
    config?: Config,
  ) => Floor[];
  useAllFloorsUnsuspended: <Config extends HookConfig<FloorFilter>>(
    config?: Config,
  ) => { data: Floor[]; status: QueryStatus };
  useAllFloorsPaginated: <
    Config extends HookConfig<FloorFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    Floor[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
      status: QueryStatus;
    },
  ];
  useAllFloorsInfinite: <
    Config extends HookConfig<FloorFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    Floor[],
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
