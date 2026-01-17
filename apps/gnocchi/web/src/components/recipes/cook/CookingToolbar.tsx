import { Button, Icon } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import classNames from 'classnames';
import { useCallback, useRef } from 'react';
import { RecipeIngredientsViewer } from '../viewer/RecipeIngredientsViewer.jsx';

export interface CookingToolbarProps {
	recipe: Recipe;
	className?: string;
}

const PEEK_HEIGHT = 300;
const MAX_HEIGHT = 500;

const AnimatedButton = animated(Button);

export function CookingToolbar({ recipe, className }: CookingToolbarProps) {
	const { containerRef, containerStyle, bind } = useExpandingContainer();

	return (
		<div
			className={classNames(
				'relative bottom-[calc(0.25rem*-1)] mb-2 w-full flex flex-col items-center',
				className,
			)}
		>
			<div className="relative z-1 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr] grid-areas-[empty_ingredients_top] w-full items-center gap-2">
				<AnimatedButton
					size="small"
					className="[grid-area:ingredients] flex touch-none items-center justify-center gap-2 rounded-full py-2 shadow-lg"
					{...bind()}
					style={{
						y: containerStyle.height.to((h) => (h > 0 ? '50%' : '0%')),
					}}
				>
					<animated.span
						className="h-15px inline-flex items-center justify-center"
						style={{
							display: containerStyle.height.to((h) =>
								h > 0 ? 'none' : 'block',
							),
						}}
					>
						<Icon name="bulletList" />
					</animated.span>
					<animated.span
						className="h-15px inline-flex items-center justify-center"
						style={{
							display: containerStyle.height.to((h) =>
								h > 0 ? 'block' : 'none',
							),
						}}
					>
						<Icon name="drag_vertical" />
					</animated.span>
					<animated.span>
						{containerStyle.height.to((h) =>
							h > 0 ? 'Resize / Close' : 'Ingredients',
						)}
					</animated.span>
				</AnimatedButton>
				<Button
					emphasis="default"
					className="[grid-area:top] mr-2 justify-self-end shadow-lg"
					onClick={() => {
						// careful, this relies on page structure in RecipeOverview...
						const top = document.getElementById('pageTop');
						top?.scrollIntoView({ behavior: 'smooth' });
					}}
				>
					<Icon name="arrowUp" />
				</Button>
			</div>

			<animated.div
				ref={containerRef}
				className="relative w-full overflow-hidden rounded-lg bg-white"
				style={{
					height: containerStyle.height,
					border: containerStyle.height.to((h) =>
						h > 0 ? '1px solid currentColor' : 'none',
					),
				}}
			>
				<div className="mt-3 h-full flex flex-col items-center overflow-overlay px-1 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
					<RecipeIngredientsViewer recipe={recipe} className="important:p-2" />
				</div>
			</animated.div>
		</div>
	);
}

function useExpandingContainer(onOpen?: () => void) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerStyle, containerSpring] = useSpring(() => ({
		height: 0,
		config: { tension: 300, friction: 30 },
	}));

	const lastExpandedHeightRef = useRef(PEEK_HEIGHT);

	const onToggle = () => {
		if (containerStyle.height.goal) {
			containerSpring.start({ height: 0 });
		} else {
			containerSpring.start({
				height: Math.max(PEEK_HEIGHT, lastExpandedHeightRef.current),
			});
			onOpen?.();
		}
	};

	const bind = useDrag(({ delta: [, dy], tap }) => {
		let target = Math.min(MAX_HEIGHT, containerStyle.height.goal - dy);
		if (target < 24) {
			target = 0;
		} else {
			onOpen?.();
		}
		if (target >= PEEK_HEIGHT) {
			lastExpandedHeightRef.current = target;
		}
		containerSpring.start({
			height: target,
			immediate: true,
		});
		if (tap) {
			onToggle();
		}
	});

	const close = useCallback(() => {
		containerSpring.start({ height: 0 });
	}, [containerSpring]);

	return { containerRef, bind, containerStyle, close };
}
