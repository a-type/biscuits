import { UsfmRenderer } from '@/components/usfm/UsfmRenderer.jsx';
import { useSuspenseQuery } from '@tanstack/react-query';

export interface BookProps {
  id: string;
}

export function Book({ id }: BookProps) {
  const { data: book } = useBook(id);

  if (!book) {
    return <div>Loading...</div>;
  }

  return <UsfmRenderer root={book} />;
}

function useBook(id: string) {
  return useSuspenseQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id),
  });
}

async function getBook(id: string) {
  const res = await fetch(`/translations/web/usfm/${id}eng-web.usfm`);
  return res.text();
}
