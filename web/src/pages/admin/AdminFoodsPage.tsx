import { Button } from '@a-type/ui/components/button';
import { graphql, useSuspenseQuery } from '@biscuits/client';
import { useState } from 'react';

export interface AdminFoodsPageProps {}

const foodsByLetter = graphql(`
  query FoodsByLetter($letter: String!, $after: ID) {
    foods(startsWith: $letter, first: 50, after: $after) {
      edges {
        node {
          id
          canonicalName
          alternateNames
          category {
            id
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

export function AdminFoodsPage({}: AdminFoodsPageProps) {
  const [letter, setLetter] = useState('a');
  const { data, fetchMore } = useSuspenseQuery(foodsByLetter, {
    variables: {
      letter,
      after: undefined,
    },
    refetchWritePolicy: 'merge',
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        letter,
        after: data.foods.pageInfo.endCursor,
      },
    });
  };

  return (
    <div className="col">
      <select value={letter} onChange={(e) => setLetter(e.target.value)}>
        {Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)).map(
          (letter) => (
            <option key={letter} value={letter}>
              {letter}
            </option>
          ),
        )}
      </select>
      <ul>
        {data.foods.edges.map(({ node }) => (
          <li key={node.id}>
            {node.canonicalName} ({node.alternateNames.join(', ')}) -{' '}
            {node.category?.name ?? 'Unassigned'}
          </li>
        ))}
      </ul>
      {data.foods.pageInfo.hasNextPage && (
        <Button onClick={loadMore}>Load More</Button>
      )}
    </div>
  );
}

export default AdminFoodsPage;
