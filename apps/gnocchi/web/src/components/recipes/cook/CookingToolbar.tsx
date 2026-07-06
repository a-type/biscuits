import { Button, Icon } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import classNames from 'classnames';
import { useCallback, useRef } from 'react';
import { RecipeIngredientsViewer } from '../viewer/RecipeIngredientsViewer.jsx';
import cls from './CookingToolbar.module.css';

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
		<div className={classNames(cls.root, className)}>
			<div className={cls.grid}>
				<AnimatedButton
					size="small"
					className={cls.ingredientsButton}
					{...bind()}
					style={{
						y: containerStyle.height.to((h) => (h > 0 ? '50%' : '0%')),
					}}
				>
					<animated.span
						className={cls.listIconWrapper}
						style={{
							display: containerStyle.height.to((h) =>
								h > 0 ? 'none' : 'block',
							),
						}}
					>
						<Icon name="bulletList" />
					</animated.span>
					<animated.span
						className={cls.listIconWrapper}
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
					className={cls.top}
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
				className={cls.ingredients}
				style={{
					height: containerStyle.height,
					border: containerStyle.height.to((h) =>
						h > 0 ? '1px solid currentColor' : 'none',
					),
				}}
			>
				<div className={cls.ingredientsInner}>
					<RecipeIngredientsViewer recipe={recipe} className={cls.wrap} />
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
