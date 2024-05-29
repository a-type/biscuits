import { useSuspenseQuery } from '@tanstack/react-query';

export function useBook(id: string) {
  return useSuspenseQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id),
  });
}

async function getBook(id: string) {
  const res = await fetch(`/translations/web/usfm/${id}eng-web.usfm`);
  return res.text();
}
