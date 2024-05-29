import { useSuspenseQuery } from '@tanstack/react-query';
import { UsfmNode } from '../usfm/nodes.jsx';

export interface BookProps {
  id: string;
}

export function Book({ id }: BookProps) {
  const { data: book } = useBook(id);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <article className="leading-loose">
      <UsfmNode text={book} />
    </article>
  );
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
