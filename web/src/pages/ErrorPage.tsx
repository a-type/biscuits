import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { H1, P } from '@a-type/ui/components/typography';

export interface ErrorPageProps {}

export function ErrorPage({}: ErrorPageProps) {
  return (
    <PageRoot>
      <PageContent>
        <H1>Something went wrong</H1>
        <P>Sorry, we couldn&apos;t load this page. Please try again later.</P>
      </PageContent>
    </PageRoot>
  );
}

export default ErrorPage;
