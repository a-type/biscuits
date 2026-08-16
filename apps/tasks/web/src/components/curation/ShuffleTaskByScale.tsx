import { hooks } from '@/hooks.js';
import { scaleDurations } from '@/time.js';
import { Box, BoxProps, Button, Icon, Select } from '@a-type/ui';
import { Task, TaskScale } from '@tasks.biscuits/verdant';
import { createContext, use, useCallback, useEffect, useState } from 'react';
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
					<ShuffleButton />
					<Select
						value={scaleFilter ? scaleFilter.toString() : ''}
						onValueChange={(valStr) => {
							if (!valStr) {
								setScaleFilter(0);
								return;
							}
							const valInt = parseInt(valStr);
							if (isNaN(valInt)) {
								setScaleFilter(0);
							} else {
								setScaleFilter(valInt as TaskScale);
							}
						}}
						items={scaleFilterItems}
					>
						<Select.Trigger placeholder="Size..." />
						<Select.Content>
							{scaleFilterItems.map((item) => (
								<Select.Item key={item.value} value={item.value}>
									{item.label}
								</Select.Item>
							))}
						</Select.Content>
					</Select>
				</Box>
				<Box col gap="sm">
					<ShuffledTask />
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
	const randomMatch = matches[Math.floor(randomPosition * matches.length)];
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
		<Button
			onClick={shuffle}
			emphasis="light"
			aria-label="Shuffle tasks"
			align="start"
		>
			<Icon name="refresh" />
		</Button>
	);
}
