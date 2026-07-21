import {
	PageContent,
	PageRoot,
	TabsList,
	TabsRoot,
	TabsTrigger,
} from '@a-type/ui';
import { graphql, useSuspenseQuery } from '@biscuits/graphql';
import { Link } from '@biscuits/client';
import { Outlet, useNavigate } from '@tanstack/react-router';

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
	const tabValue = location.pathname.split('/')[2];

	if (!data?.me?.isProductAdmin) {
		navigate({ to: '/login' });
		return null;
	}

	return (
		<PageRoot>
			<PageContent>
				<TabsRoot value={tabValue}>
					<TabsList>
						<TabsTrigger value="plans" render={<Link to="/admin/plans" />}>
							Plans
						</TabsTrigger>
						<TabsTrigger value="foods" render={<Link to="/admin/foods" />}>
							Foods
						</TabsTrigger>
						<TabsTrigger
							value="foodCategories"
							render={<Link to="/admin/foodCategories" />}
						>
							Food Categories
						</TabsTrigger>
						<TabsTrigger
							value="changelogs"
							render={<Link to="/admin/changelogs" />}
						>
							Changelogs
						</TabsTrigger>
					</TabsList>
				</TabsRoot>
				<Outlet />
			</PageContent>
		</PageRoot>
	);
}

export default AdminPage;
