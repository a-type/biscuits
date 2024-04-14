import { Link } from '@/components/nav/Link.jsx';
import { Button } from '@a-type/ui/components/button';
import { PageContent } from '@a-type/ui/components/layouts';

export function NotFoundPage() {
  return (
    <PageContent className="rounded-b-lg border-b border-b-solid border-b-[#00000070] bg-wash sm:border-none sm:rounded-0">
      <div className="flex flex-col gap-3">
        <span>Page not found.</span>
        <Link to="/">
          <Button>Go home</Button>
        </Link>
      </div>
    </PageContent>
  );
}
