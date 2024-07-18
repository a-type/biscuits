import {
  Context,
  ComponentType,
  ReactNode,
  ChangeEvent,
  FocusEvent,
} from "react";
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
  EntityInit,
  EntityFile,
  List,
  ListFilter,
  Item,
  ItemFilter,
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
    value: ClientDescriptor<any, any>;
    children: ReactNode;
    sync?: boolean;
  }>;
  /**
   * Direct access to the React Context, if needed.
   */
  Context: Context<ClientDescriptor<any, any>>;
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

  useItem(id: string, config?: { skip?: boolean }): Item | null;
  useItemUnsuspended(
    id: string,
    config?: { skip?: boolean },
  ): { data: Item | null; status: QueryStatus };
  useOneItem: <Config extends HookConfig<ItemFilter>>(
    config?: Config,
  ) => Item | null;
  useOneItemsUnsuspended: <Config extends HookConfig<ItemFilter>>(
    config?: Config,
  ) => { data: Item | null; status: QueryStatus };
  useAllItems: <Config extends HookConfig<ItemFilter>>(
    config?: Config,
  ) => Item[];
  useAllItemsUnsuspended: <Config extends HookConfig<ItemFilter>>(
    config?: Config,
  ) => { data: Item[]; status: QueryStatus };
  useAllItemsPaginated: <
    Config extends HookConfig<ItemFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    Item[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
      status: QueryStatus;
    },
  ];
  useAllItemsInfinite: <
    Config extends HookConfig<ItemFilter> & {
      pageSize?: number;
      suspend?: false;
    },
  >(
    config?: Config,
  ) => [
    Item[],
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
