import { useLocalStorage } from './useStorage.js';

export function useWasLoggedIn() {
  return useLocalStorage('wasLoggedIn', false);
}
