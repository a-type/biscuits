import { ShuffleTaskByScale } from '@/components/curation/ShuffleTaskByScale.jsx';
import { TopBlocker } from '@/components/curation/TopBlocker.jsx';
import { TaskQuickAdd } from '@/components/tasks/TaskQuickAdd.jsx';
import { Box, Heading, PageContent } from '@a-type/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: HomePage,
});

function HomePage() {
	return (
		<PageContent>
			<Box surface col gap border p>
				<Heading render={<h2 />} emphasis="ambient" className="sr-only">
					Quick Add
				</Heading>
				<TaskQuickAdd />
			</Box>
			<Box p col gap>
				<Heading render={<h2 />} emphasis="ambient">
					Get something done
				</Heading>
				<ShuffleTaskByScale />
			</Box>
			<Box p col gap>
				<Heading render={<h2 />} emphasis="ambient">
					Unblock your projects
				</Heading>
				<TopBlocker />
			</Box>
		</PageContent>
	);
}
