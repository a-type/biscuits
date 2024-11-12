import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';
import {
	EntityFile,
	Project,
	ProjectColors,
	ProjectColorsItem,
} from '@palette.biscuits/verdant';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useColorSelection } from './hooks.js';
import {
	CanvasRoot,
	useClaimedGestures,
	useCreateCanvas,
	useCreateViewport,
	useViewport,
	ViewportRoot,
	useClaimGesture,
	useCanvas,
	Vector2,
} from '@a-type/react-space';
import { ref, useSnapshot } from 'valtio';
import { toolState } from './state.js';
import { preventDefault } from '@a-type/utils';

export interface ProjectCanvasProps {
	project: Project;
	className?: string;
}
export function ProjectCanvas({ project, className }: ProjectCanvasProps) {
	const { image, colors } = hooks.useWatch(project);
	const { showBubbles, activelyPicking } = useSnapshot(toolState);

	const viewport = useCreateViewport({
		panLimitMode: 'viewport',
		defaultZoom: 0.1,
		zoomLimits: {
			min: 'fit',
			max: 3,
		},
	});

	return (
		<div
			className={clsx(
				'relative flex flex-col w-full sm:(w-auto h-full)',
				className,
			)}
		>
			<ViewportRoot viewport={viewport} className="flex-grow-1 h-auto">
				<ColorPickerCanvas image={image} />
				{showBubbles && !activelyPicking && <Bubbles colors={colors} />}
				<PickingBubble />
			</ViewportRoot>
		</div>
	);
}

function ColorPickerCanvas({
	image: imageModel,
	className,
}: {
	image: EntityFile;
	className?: string;
}) {
	hooks.useWatch(imageModel);
	const imageSrc = imageModel.url;

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const viewport = useViewport();
	const logicalCanvas = useCreateCanvas({
		viewport,
	});

	const [image, setImage] = useState<HTMLImageElement | null>(null);

	useEffect(() => {
		if (!imageSrc) return;
		const image = new Image();
		image.crossOrigin = 'anonymous';
		image.onload = () => {
			logicalCanvas.resize({
				min: { x: 0, y: 0 },
				max: { x: image.width, y: image.height },
			});
			logicalCanvas.viewport.fitOnScreen({
				x: 0,
				y: 0,
				width: image.width,
				height: image.height,
			});
			setImage(image);
		};
		image.src = imageSrc + (imageSrc.startsWith('blob') ? '' : '?canvas=true');
	}, [imageSrc, logicalCanvas]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!image || !canvas) return;

		canvas.width = image.width;
		canvas.height = image.height;
		canvas.style.setProperty('width', `${image.width}px`);
		canvas.style.setProperty('height', `${image.height}px`);
		// enforce aspect ratio
		canvas.style.setProperty('aspect-ratio', `${image.width}/${image.height}`);
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(image, 0, 0);
	}, [image, canvasRef]);

	const getCanvasColors = useCallback(
		(x: number, y: number, xRange: number = 1, yRange: number = 1) => {
			const canvas = canvasRef.current;
			if (!canvas) return null;
			const ctx = canvas.getContext('2d');
			if (!ctx) return null;

			return ctx.getImageData(x, y, xRange, yRange).data;
		},
		[canvasRef],
	);

	return (
		<CanvasRoot canvas={logicalCanvas} onContextMenu={preventDefault}>
			{/* <CanvasBackground> */}
			<canvas ref={canvasRef} className={clsx('touch-none', className)} />
			{/* </CanvasBackground> */}
			{/* bubble preview */}
			<BubblePicker getCanvasColors={getCanvasColors} />
		</CanvasRoot>
	);
}

function BubblePicker({
	getCanvasColors,
}: {
	getCanvasColors: (
		x: number,
		y: number,
		xRange?: number,
		yRange?: number,
	) => Uint8ClampedArray | null;
}) {
	const previewRef = useRef<HTMLDivElement>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const dotRef = useRef<HTMLDivElement>(null);
	const show = useSnapshot(toolState).activelyPicking;
	const [_, setSelected] = useColorSelection();

	useClaimGesture(
		'tool',
		'bubble',
		(detail) => {
			if (detail.isTouch) {
				return detail.touchesCount < 2;
			}
			return detail.isLeftMouse;
		},
		{
			onCanvas: true,
		},
	);

	const canvas = useCanvas();

	const updatePreview = useCallback(
		(x: number, y: number) => {
			// sample 17x17 pixels around the pointer
			const colors = getCanvasColors(x - 8, y - 8, 17, 17);
			if (!colors) return;
			// write them to the preview canvas, scaled up to fill the whole thing
			const previewCanvas = previewCanvasRef.current;
			if (previewCanvas) {
				previewCanvas.width = 17;
				previewCanvas.height = 17;
				const previewCtx = previewCanvas.getContext('2d');
				if (previewCtx) {
					const previewImageData = previewCtx.createImageData(17, 17);
					const previewData = previewImageData.data;
					for (let i = 0; i < 17 * 17; i++) {
						previewData[i * 4] = colors[i * 4];
						previewData[i * 4 + 1] = colors[i * 4 + 1];
						previewData[i * 4 + 2] = colors[i * 4 + 2];
						previewData[i * 4 + 3] = 255;
					}
					previewCtx.putImageData(previewImageData, 0, 0);
				}

				// also update color state with center color
				const centerColor = {
					r: colors[576],
					g: colors[577],
					b: colors[578],
				};
				const canvasRect = canvas.limits.value;
				const canvasWidth = canvasRect.max.x - canvasRect.min.x;
				const canvasHeight = canvasRect.max.y - canvasRect.min.y;
				const canvasX = x / canvasWidth;
				const canvasY = y / canvasHeight;
				toolState.pickedColor = ref({
					value: centerColor,
					percentage: { x: canvasX, y: canvasY },
					pixel: { x, y },
				});
				dotRef.current?.style.setProperty(
					'background-color',
					`rgb(${centerColor.r}, ${centerColor.g}, ${centerColor.b})`,
				);
			}
		},
		[previewCanvasRef],
	);

	const updatePosition = useCallback(
		(worldPosition: Vector2, screenPosition: Vector2) => {
			const preview = previewRef.current;
			if (!preview) return;
			preview.style.setProperty('--x', `${worldPosition.x}px`);
			preview.style.setProperty('--y', `${worldPosition.y}px`);

			const size = preview.computedStyleMap().get('--size');
			const sizeValue = size ? parseInt(size.toString()) : 0;

			const flipX = screenPosition.x - sizeValue * 1.5 <= 0;
			preview.style.setProperty('--x-mult', flipX ? `1` : `-1`);
			const flipY = screenPosition.y - sizeValue * 1.5 <= 0;
			preview.style.setProperty('--y-mult', flipY ? `1` : `-1`);

			preview.style.setProperty('border-radius', '9999px');
			if (flipX && flipY) {
				preview.style.setProperty('border-top-left-radius', '0');
			} else if (flipX) {
				preview.style.setProperty('border-bottom-left-radius', '0');
			} else if (flipY) {
				preview.style.setProperty('border-top-right-radius', '0');
			} else {
				preview.style.setProperty('border-bottom-right-radius', '0');
			}
		},
		[previewRef],
	);

	useClaimedGestures(
		{
			onDragStart: ({ pointerWorldPosition, screenPosition }) => {
				const { x, y } = pointerWorldPosition;
				const preview = previewRef.current;
				if (!preview) return;
				updatePosition(pointerWorldPosition, screenPosition);
				updatePreview(x, y);
				toolState.activelyPicking = true;
				setSelected(null);
			},
			onDrag: (
				{ pointerWorldPosition, screenPosition, touchesCount },
				tools,
			) => {
				if (touchesCount > 1) {
					tools.abandon();
					return;
				}

				const { x, y } = pointerWorldPosition;
				const preview = previewRef.current;
				if (!preview) return;
				updatePosition(pointerWorldPosition, screenPosition);
				updatePreview(x, y);
				toolState.activelyPicking = true;
			},
			onDragEnd: () => {
				toolState.activelyPicking = false;
			},
			onAbandon: () => {
				previewRef.current?.style.setProperty('display', 'none');
				toolState.pickedColor = null;
				toolState.activelyPicking = false;
			},
		},
		'bubble',
	);

	return (
		<div
			ref={previewRef}
			className={clsx(
				'[--size:160px] [--pointer-size:32px] [--x-mult:1] [--y-mult:1] [--x:0] [--y:0]',
				'md:[--size:84px] md:[--pointer-size:0px]',
				'[transform:translate(-50%,-50%)_translate(calc(var(--x-mult,1)*(var(--size)+var(--pointer-size))/2/var(--zoom,1)),calc(var(--y-mult,1)*(var(--size)+var(--pointer-size))/2/var(--zoom,1)))]',
				'left-[var(--x)] top-[var(--y)]',
				'w-[calc(var(--size)/var(--zoom,1))] h-[calc(var(--size)/var(--zoom,1))]',
				'fixed pointer-events-none border-1 border-solid border-gray-4 overflow-hidden',
				show ? 'block' : 'hidden',
			)}
		>
			<canvas ref={previewCanvasRef} className="w-full h-full" />
			<div
				ref={dotRef}
				className="absolute z-1 left-1/2 top-1/2 -translate-1/2 w-[calc(var(--size)/6/var(--zoom))] h-[calc(var(--size)/6/var(--zoom))] rounded-full border-1 border-solid border-gray-4"
			/>
		</div>
	);
}

function Bubbles({ colors }: { colors: ProjectColors }) {
	const liveColors = hooks.useWatch(colors);

	return (
		<div className="absolute inset-0 pointer-events-none">
			{liveColors.map((color, i) => (
				<Bubble color={color} key={i} />
			))}
		</div>
	);
}

const BUBBLE_SIZE_LG = 64;
const BUBBLE_SIZE_SM = 32;

function Bubble({ color: colorVal }: { color: ProjectColorsItem }) {
	const { percentage, value, id } = hooks.useWatch(colorVal);
	const { x, y } = hooks.useWatch(percentage);
	const { r, g, b } = hooks.useWatch(value);
	const [selectedId, setSelected] = useColorSelection();
	const selected = selectedId === id;

	return (
		<button
			onClick={() => {
				setSelected(id);
				toolState.pickedColor = null;
			}}
			className={clsx(
				'absolute rounded-full pointer-events-auto -translate-1/2 border-solid border-black appearance-none min-h-0 min-w-0 p-0 m-0',
			)}
			style={{
				backgroundColor: `rgb(${r}, ${g}, ${b})`,
				left: `${x * 100}%`,
				top: `${y * 100}%`,
				width: `calc(${selected ? BUBBLE_SIZE_LG : BUBBLE_SIZE_SM}px / var(--zoom, 1))`,
				height: `calc(${selected ? BUBBLE_SIZE_LG : BUBBLE_SIZE_SM}px / var(--zoom, 1))`,
				borderWidth: 'calc(1px/var(--zoom,1))',
				boxShadow: '0 0 0 calc(1px/var(--zoom,1)) var(--color-white)',
				zIndex: selected ? 1 : 0,
			}}
		/>
	);
}

function PickingBubble() {
	const { pickedColor, activelyPicking } = useSnapshot(toolState);

	if (!pickedColor || activelyPicking) return;

	return (
		<div
			className="absolute pointer-events-none -translate-1/2"
			style={{
				left: `${pickedColor.percentage.x * 100}%`,
				top: `${pickedColor.percentage.y * 100}%`,
				width: `calc(${BUBBLE_SIZE_LG}px / var(--zoom, 1))`,
				height: `calc(${BUBBLE_SIZE_LG}px / var(--zoom, 1))`,
			}}
		>
			<div
				className={clsx(
					'absolute rounded-full pointer-events-none border-dashed border-white animate-spin animate-duration-20s w-full h-full',
				)}
				style={{
					backgroundColor: `rgb(${pickedColor.value.r}, ${pickedColor.value.g}, ${pickedColor.value.b})`,
					borderWidth: `calc(2px / var(--zoom, 1))`,
				}}
			/>
		</div>
	);
}
