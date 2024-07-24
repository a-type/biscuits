import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { useEffect } from 'react';
import { HubWishlistData } from './types.js';

const innerProps = {
  className: 'max-w-600px',
};

export function App({ recipe: data }: { recipe: HubWishlistData }) {
  useEffect(() => {
    // set page title to recipe title on load
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
    <PageRoot className="theme-leek">
      <PageContent innerProps={innerProps}></PageContent>
    </PageRoot>
  );
}
