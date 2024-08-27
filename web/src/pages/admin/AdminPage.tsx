import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { TabsList, TabsRoot, TabsTrigger } from '@a-type/ui/components/tabs';
import { graphql, useSuspenseQuery } from '@biscuits/graphql';
import {
	Link,
	Outlet,
	useNavigate,
	useParams,
} from '@verdant-web/react-router';

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
		navigate('/login');
		return null;
	}

	return (
		<PageRoot>
			<PageContent>
				<TabsRoot value={tabValue}>
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
						<TabsTrigger value="changelogs" asChild>
							<Link to="/admin/changelogs">Changelogs</Link>
						</TabsTrigger>
					</TabsList>
				</TabsRoot>
				<Outlet />
			</PageContent>
		</PageRoot>
	);
}

export default AdminPage;
