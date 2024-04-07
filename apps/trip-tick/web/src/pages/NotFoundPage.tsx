import { PageContent } from '@a-type/ui/components/layouts';
import { Link } from '@verdant-web/react-router';
import { Button } from '@a-type/ui/components/button';
import { H1 } from '@a-type/ui/components/typography';

export interface NotFoundPageProps {}

export function NotFoundPage({}: NotFoundPageProps) {
  return (
    <PageContent>
      <div className="flex flex-col gap-4 items-start">
        <H1>Not Found</H1>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </PageContent>
  );
}

export default NotFoundPage;
