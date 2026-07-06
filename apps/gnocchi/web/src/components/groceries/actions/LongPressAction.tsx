import { useAnimationFrame } from '@/hooks/useAnimationFrame.js';
import { preventDefault } from '@/lib/eventHandlers.js';
import { ActionButton, ActionButtonProps, Box, Popover } from '@a-type/ui';
import { useDrag } from '@use-gesture/react';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import cls from './LongPressAction.module.css';

export type LongPressActionProps = ActionButtonProps & {
	onActivate: () => void;
	duration?: number;
	progressColor?: 'attention' | 'accent' | 'primary';
	delay?: number;
};

/**
 * The press gesture must remain within THRESHOLD_DISTANCE until delay time has passed
 * to be considered a press.
 *
 * After delay, the gesture must remain within CANCEL_DISTANCE or be cancelled.
 */
const THRESHOLD_DISTANCE = 10;
const CANCEL_DISTANCE = 30;

export function LongPressAction({
	onActivate,
	progressColor = 'attention',
	children,
	duration = 2000,
	delay = 200,
	...rest
}: LongPressActionProps) {
	const [gestureState, setGestureState] = useState<'released' | 'pressed'>(
		'released',
	);
	const [state, setState] = useState<'holding' | 'idle' | 'failed' | 'pending'>(
		'idle',
	);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const ref = useRef<HTMLButtonElement>(null);

	const gestureStateRef = useRef<{ distance: number; startedAt: number }>({
		distance: 0,
		startedAt: 0,
	});
	useDrag(
		({ first, cancel, elapsedTime, down, distance }) => {
			const totalDistance = Math.sqrt(
				Math.pow(distance[0], 2) + Math.pow(distance[1], 2),
			);
			gestureStateRef.current.distance = totalDistance;

			if (elapsedTime < delay && totalDistance > THRESHOLD_DISTANCE) {
				cancel();
				setGestureState('released');
				return;
			}

			if (totalDistance > CANCEL_DISTANCE) {
				cancel();
				setGestureState('released');
				return;
			}

			if (first) {
				gestureStateRef.current.startedAt = Date.now();
				try {
					navigator?.vibrate?.(200);
				} catch (err) {
					console.log(err);
				}
			}

			if (down) {
				setGestureState('pressed');
			} else {
				setGestureState('released');
			}
		},
		{
			// triggerAllEvents: true,
			// preventDefault: true,
			target: ref,
		},
	);

	useAnimationFrame(() => {
		const gestureDuration = gestureStateRef.current.startedAt
			? Date.now() - gestureStateRef.current.startedAt
			: 0;
		const distance = gestureStateRef.current.distance;

		// nothing to do in this case
		if (
			gestureState === 'released' &&
			(state === 'idle' || state === 'failed')
		) {
			return;
		}

		if (gestureState === 'released') {
			if (state === 'holding') {
				// holding for longer than duration - activate
				if (gestureDuration >= duration + delay && distance < CANCEL_DISTANCE) {
					onActivate();
					setState('idle');
				} else {
					// normal release before duration - cancel
					setState('idle');
				}
			} else if (state === 'pending' && distance < THRESHOLD_DISTANCE) {
				setState('failed');
			}
		} else if (gestureState === 'pressed') {
			// begin a new press
			if (state === 'idle' || state === 'failed') {
				setState('pending');
			} else if (state === 'pending' && gestureDuration >= delay) {
				// begin holding after delay has passed
				setState('holding');
			} else if (distance > CANCEL_DISTANCE) {
				// cancel if moved too far
				setState('idle');
			}
		}
	});

	useEffect(() => {
		if (state === 'failed') {
			const timeout = setTimeout(() => {
				setState('idle');
			}, 1000);
			return () => {
				clearTimeout(timeout);
			};
		}
	}, [state]);

	return (
		<Popover modal={false} open={state !== 'idle' && state !== 'pending'}>
			<ActionButton
				size="small"
				onContextMenu={preventDefault}
				ref={ref}
				{...rest}
				className={rest.className}
			>
				{children}
			</ActionButton>

			<Popover.Content
				anchor={ref}
				style={{ padding: 0 }}
				side="top"
				sideOffset={16}
			>
				<Popover.Arrow />
				<Box overflow="hidden" rounded="lg" className={cls.popup}>
					<Box
						className={classNames(`@mode-${progressColor}`, cls.progress)}
						data-state={state}
						surface="secondary"
						style={{
							animationDuration: `${duration}ms`,
						}}
						// eslint-disable-next-line react-hooks/refs
						key={timeoutRef.current as any}
					/>
					<Box className={cls.z}>Hold for 2 seconds</Box>
				</Box>
			</Popover.Content>
		</Popover>
	);
}
