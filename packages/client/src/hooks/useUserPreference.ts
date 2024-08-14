import { useCallback, useEffect } from 'react';
import { graphql, useMutation, useQuery } from '../graphql.js';
import { useIsLoggedIn } from './graphql.js';
import { useLocalStorage } from './useStorage.js';

const userPreference = graphql(`
  query UserPreference($key: String!) {
    me {
      id
      preference(key: $key) {
        id
        value
      }
    }
  }
`);

const setPreference = graphql(`
  mutation SetUserPreference($key: String!, $value: JSON!) {
    setUserPreference(input: { key: $key, value: $value }) {
      user {
        id
        preference(key: $key) {
          id
          value
        }
      }
    }
  }
`);

export function useUserPreference<T>(key: string, defaultValue: T) {
  const [localValue, setLocalValue] = useLocalStorage(
    `userPreference-${key}`,
    defaultValue,
    true,
  );
  const isLoggedIn = useIsLoggedIn();
  const { data } = useQuery(userPreference, {
    variables: {
      key,
    },
    skip: !isLoggedIn,
  });

  const remoteValue = data?.me?.preference?.value;

  useEffect(() => {
    if (remoteValue) {
      setLocalValue(remoteValue);
    }
  }, [remoteValue, setLocalValue]);

  const [setRemoteValue] = useMutation(setPreference);
  const setValue = useCallback(
    async (value: T) => {
      if (isLoggedIn) {
        await setRemoteValue({
          variables: {
            key,
            value,
          },
        });
      }
      setLocalValue(value);
    },
    [isLoggedIn, setRemoteValue, setLocalValue, key],
  );

  return [remoteValue ?? localValue, setValue];
}
