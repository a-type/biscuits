import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { TabsList, TabsRoot, TabsTrigger } from '@a-type/ui/components/tabs';
import { graphql, useSuspenseQuery } from '@biscuits/client';
import { Link, Outlet, useNavigate } from '@verdant-web/react-router';

export interface AdminPageProps {}

const adminAccess = graphql(`
  query AdminAccess {
    me {
      isProductAdmin
    }
  }
`);

export function AdminPage({}: AdminPageProps) {
  const { data } = useSuspenseQuery(adminAccess);
  const navigate = useNavigate();

  if (!data.me.isProductAdmin) {
    navigate('/login');
    return null;
  }

  return (
    <PageRoot>
      <PageContent>
        <TabsRoot>
          <TabsList>
            <TabsTrigger value="plans" asChild>
              <Link to="/admin/plans">Plans</Link>
            </TabsTrigger>
            <TabsTrigger value="foods" asChild>
              <Link to="/admin/foods">Foods</Link>
            </TabsTrigger>
            <TabsTrigger value="foodCategories" asChild>
              <Link to="/admin/foodCategories">Food Categories</Link>
            </TabsTrigger>
          </TabsList>
        </TabsRoot>
        <Outlet />
      </PageContent>
    </PageRoot>
  );
}

export default AdminPage;
