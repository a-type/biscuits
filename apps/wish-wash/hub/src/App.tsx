import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { H1, P } from '@a-type/ui/components/typography';
import React, { useEffect } from 'react';
import { HubWishlistData } from './types.js';
import { ApolloProvider, graphqlClient } from '@biscuits/client/graphql';

const innerProps = {
  className: 'max-w-600px',
};

export function App({ list: data }: { list: HubWishlistData }) {
  useEffect(() => {
    // set page title to list title on load
    document.title = data.title;
  }, [data.title]);

  if (!data) {
    return (
      <PageRoot className="theme-leek">
        <PageContent>
          <H1>Wish list not found</H1>
        </PageContent>
      </PageRoot>
    );
  }

  return (
    <ApolloProvider client={graphqlClient}>
      <PageRoot className="theme-leek">
        <PageContent innerProps={innerProps}>
          <H1>{data.title}</H1>
          <P>{data.items.length} items</P>
        </PageContent>
      </PageRoot>
    </ApolloProvider>
  );
}
