import { UsfmNode } from '../usfm/nodes.jsx';
import { useBook } from './hooks.js';

export interface BookProps {
  id: string;
}

export function Book({ id }: BookProps) {
  const { data: book } = useBook(id);

  return (
    <article className="leading-loose">
      <UsfmNode text={book} />
    </article>
  );
}
