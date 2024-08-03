import { useSearchParams } from '@verdant-web/react-router';

export function useEditItem() {
  const [_, setSearch] = useSearchParams();
  return (id: string) =>
    setSearch((s) => {
      s.set('itemId', id);
      return s;
    });
}
