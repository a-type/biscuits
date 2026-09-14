import { useOnlyUnblockedTasks } from '@/graph.js';
import { hooks } from '@/hooks.js';
import { scaleDurations } from '@/time.js';
import {
	ActionButton,
	Box,
	BoxProps,
	Button,
	HorizontalList,
	Icon,
} from '@a-type/ui';
import { Task, TaskScale } from '@tasks.biscuits/verdant';
import {
	createContext,
	startTransition,
	Suspense,
	use,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { TaskSummaryCard } from '../tasks/TaskSummaryCard.js';

export interface ShuffleTaskByScaleProps extends BoxProps {
	defaultScale?: TaskScale;
}

const scaleFilterItems = scaleDurations.map((label, index) => ({
	label,
	value: index.toString(),
}));

export function ShuffleTaskByScale({
	defaultScale = 0,
	...boxProps
}: ShuffleTaskByScaleProps) {
	const [scaleFilter, setScaleFilter] = useState<TaskScale>(defaultScale);

	return (
		<ShuffledTaskProvider scale={scaleFilter}>
			<Box gap col full="width" {...boxProps}>
				<Box gap items="center">
					<HorizontalList>
						<ShuffleButton />
						{scaleFilterItems.map((item) => (
							<ActionButton
								key={item.value}
								toggled={scaleFilter === parseInt(item.value)}
								onClick={() => {
									startTransition(() => {
										setScaleFilter(parseInt(item.value) as TaskScale);
									});
								}}
							>
								{item.label}
							</ActionButton>
						))}
					</HorizontalList>
				</Box>
				<Box col gap="sm">
					<Suspense>
						<ShuffledTask />
					</Suspense>
				</Box>
			</Box>
		</ShuffledTaskProvider>
	);
}

const ShuffledTaskContext = createContext<{
	task: Task | null;
	shuffle: () => void;
}>({ task: null, shuffle: () => {} });

function ShuffledTaskProvider({
	scale,
	children,
}: {
	scale: TaskScale;
	children: React.ReactNode;
}) {
	const [randomPosition, setRandomPosition] = useState<number>(() =>
		Math.random(),
	);
	const shuffle = useCallback(() => {
		setRandomPosition(Math.random());
	}, []);
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		shuffle();
	}, [scale, shuffle]);
	const matches = hooks.useAllTasks({
		key: `quick-task-${scale}`,
		index:
			scale === 0 ? undefined : (
				{
					where: 'scale',
					equals: scale,
				}
			),
	});
	const unblocked = useOnlyUnblockedTasks(matches);
	const randomMatch = unblocked[Math.floor(randomPosition * unblocked.length)];
	return (
		<ShuffledTaskContext.Provider
			value={{ task: randomMatch ?? null, shuffle }}
		>
			{children}
		</ShuffledTaskContext.Provider>
	);
}

function ShuffledTask() {
	const { task: randomMatch } = use(ShuffledTaskContext);
	if (!randomMatch) {
		return <Box p>Nothing found</Box>;
	}
	return <TaskSummaryCard task={randomMatch} />;
}

function ShuffleButton() {
	const { shuffle } = use(ShuffledTaskContext);
	return (
		<Button onClick={shuffle} emphasis="light" aria-label="Shuffle tasks">
			<Icon name="refresh" />
		</Button>
	);
}
