import { hooks } from '@/hooks.js';
import {
	CardGrid,
	CardImage,
	CardMain,
	CardRoot,
	InfiniteLoadTrigger,
} from '@a-type/ui';
import { Project } from '@palette.biscuits/verdant';
import { Link } from '@verdant-web/react-router';

export interface ProjectsListProps {}

export function ProjectsList({}: ProjectsListProps) {
	const [items, { hasMore, loadMore }] = hooks.useAllProjectsInfinite({
		index: {
			where: 'createdAt',
			order: 'desc',
		},
		pageSize: 20,
	});

	return (
		<>
			<CardGrid>
				{items.map((item, i) => (
					<ProjectsListItem item={item} key={i} />
				))}
			</CardGrid>
			{hasMore && <InfiniteLoadTrigger onVisible={loadMore} />}
		</>
	);
}

function ProjectsListItem({ item }: { item: Project }) {
	const { id, image } = hooks.useWatch(item);
	hooks.useWatch(image);
	return (
		<CardRoot className="h-240px">
			<CardMain render={<Link to={`/projects/${id}`} />} />
			{image.url && <CardImage render={<img src={image.url} />} />}
		</CardRoot>
	);
}
