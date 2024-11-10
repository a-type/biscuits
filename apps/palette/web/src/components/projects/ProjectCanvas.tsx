import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';
import {
	EntityFile,
	Project,
	ProjectColors,
	ProjectColorsItem,
	ProjectColorsItemInit,
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
import { useSnapshot } from 'valtio';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { toolState } from './state.js';

export interface ProjectCanvasProps {
	project: Project;
	className?: string;
}
export function ProjectCanvas({ project, className }: ProjectCanvasProps) {
	const { image, colors } = hooks.useWatch(project);
	const [_, setSelected] = useColorSelection();
	const addColor = (init: ProjectColorsItemInit) => {
		colors.push(init);
		const newColor = colors.get(colors.length - 1);
		setSelected(newColor.get('id'));
	};
	const { showBubbles, pickingColor } = useSnapshot(toolState);

	const viewport = useCreateViewport({
		panLimitMode: 'viewport',
		defaultZoom: 0.1,
		zoomLimits: {
			min: 'fit',
			max: 3,
		},
	});

	const picking = !!pickingColor;

	return (
		<div
			className={clsx(
				'relative flex flex-col w-full sm:(w-auto h-full)',
				className,
			)}
		>
			<ViewportRoot viewport={viewport} className="flex-grow-1 h-auto">
				<ColorPickerCanvas image={image} onColor={addColor} />
				{showBubbles && !picking && <Bubbles colors={colors} />}
			</ViewportRoot>
			<CanvasTools />
		</div>
	);
}

function ColorPickerCanvas({
	image: imageModel,
	onColor,
	className,
}: {
	image: EntityFile;
	onColor: (init: ProjectColorsItemInit) => void;
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

	const getCanvasSize = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return null;
		return {
			width: canvas.width,
			height: canvas.height,
		};
	}, [canvasRef]);

	return (
		<CanvasRoot canvas={logicalCanvas}>
			{/* <CanvasBackground> */}
			<canvas ref={canvasRef} className={clsx('touch-none', className)} />
			{/* </CanvasBackground> */}
			{/* bubble preview */}
			<BubblePicker
				getCanvasColors={getCanvasColors}
				getCanvasSize={getCanvasSize}
				onColor={onColor}
			/>
		</CanvasRoot>
	);
}

function BubblePicker({
	getCanvasColors,
	onPickingChange,
	getCanvasSize,
	onColor,
}: {
	getCanvasColors: (
		x: number,
		y: number,
		xRange?: number,
		yRange?: number,
	) => Uint8ClampedArray | null;
	getCanvasSize: () => { width: number; height: number } | null;
	onPickingChange?: (picking: boolean) => void;
	onColor: (color: {
		value: { r: number; g: number; b: number };
		percentage: { x: number; y: number };
		pixel: { x: number; y: number };
	}) => void;
}) {
	const previewRef = useRef<HTMLDivElement>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const dotRef = useRef<HTMLDivElement>(null);

	const { tool } = useSnapshot(toolState);

	useClaimGesture(
		'tool',
		'bubble',
		(detail) => {
			console.log('detail', detail);
			if (detail.isTouch) {
				return tool === 'bubble' || detail.touchesCount < 2;
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
				toolState.pickingColor = `rgb(${centerColor.r}, ${centerColor.g}, ${centerColor.b})`;
				dotRef.current?.style.setProperty(
					'background-color',
					toolState.pickingColor,
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
			preview.style.setProperty('display', 'block');

			const size = preview.computedStyleMap().get('--size');
			const sizeValue = size ? parseInt(size.toString()) : 0;

			const flipX = screenPosition.x - sizeValue * 2 <= 0;
			preview.style.setProperty('--x-mult', flipX ? `1` : `-1`);
			const flipY = screenPosition.y - sizeValue * 2 <= 0;
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
				onPickingChange?.(true);
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
			},
			onDragEnd: ({ pointerWorldPosition }) => {
				const { x, y } = pointerWorldPosition;

				previewRef.current?.style.setProperty('display', 'none');

				const canvasRect = canvas.limits.value;
				const canvasWidth = canvasRect.max.x - canvasRect.min.x;
				const canvasHeight = canvasRect.max.y - canvasRect.min.y;
				const canvasX = x / canvasWidth;
				const canvasY = y / canvasHeight;

				const color = getCanvasColors(x, y);
				toolState.pickingColor = null;
				if (!color) return;

				onColor({
					value: { r: color[0], g: color[1], b: color[2] },
					percentage: { x: canvasX, y: canvasY },
					pixel: { x, y },
				});
			},
			onAbandon: () => {
				previewRef.current?.style.setProperty('display', 'none');
				toolState.pickingColor = null;
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
				'fixed pointer-events-none border-1 border-solid border-gray-4 overflow-hidden hidden',
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

function Bubble({ color: colorVal }: { color: ProjectColorsItem }) {
	const { percentage, value, id } = hooks.useWatch(colorVal);
	const { x, y } = hooks.useWatch(percentage);
	const { r, g, b } = hooks.useWatch(value);
	const [selectedId, setSelected] = useColorSelection();
	const selected = selectedId === id;

	return (
		<button
			onClick={() => setSelected(id)}
			className={clsx(
				'absolute rounded-full pointer-events-auto -translate-1/2 border-solid border-1 border-gray appearance-none min-h-0 min-w-0 p-0 m-0',
				selected && 'border-2 z-1',
			)}
			style={{
				backgroundColor: `rgb(${r}, ${g}, ${b})`,
				left: `${x * 100}%`,
				top: `${y * 100}%`,
				width: `calc(${selected ? 48 : 24}px / var(--zoom, 1))`,
				height: `calc(${selected ? 48 : 24}px / var(--zoom, 1))`,
			}}
		/>
	);
}

function CanvasTools() {
	const { tool, showBubbles } = useSnapshot(toolState);

	return (
		<div className="row w-full bg-white p-2 border-gray border-1 border-solid">
			<Button
				size="icon"
				toggled={showBubbles}
				onClick={() => (toolState.showBubbles = !showBubbles)}
			>
				<Icon name={showBubbles ? 'eye' : 'eyeClosed'} />
			</Button>
			<Button
				size="icon"
				toggled={tool === 'bubble'}
				onClick={() => (toolState.tool = tool === 'bubble' ? null : 'bubble')}
			>
				<Icon name="waterDrop" />
			</Button>
		</div>
	);
}
