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
} from '@a-type/react-space';

export interface ProjectCanvasProps {
	project: Project;
	className?: string;
	showBubbles: boolean;
}
export function ProjectCanvas({
	project,
	className,
	showBubbles,
}: ProjectCanvasProps) {
	const { image, colors } = hooks.useWatch(project);
	const [_, setSelected] = useColorSelection();
	const addColor = (init: ProjectColorsItemInit) => {
		colors.push(init);
		const newColor = colors.get(colors.length - 1);
		setSelected(newColor.get('id'));
	};
	const [picking, setPicking] = useState(false);

	const viewport = useCreateViewport({
		panLimitMode: 'viewport',
		defaultZoom: 0.1,
		zoomLimits: {
			min: 'fit',
			max: 3,
		},
	});

	return (
		<div className={clsx('relative w-full sm:(w-auto h-full)', className)}>
			<ViewportRoot viewport={viewport}>
				<div className="relative">
					<ColorPickerCanvas
						image={image}
						onColor={addColor}
						onPickingChange={setPicking}
					/>
					{showBubbles && !picking && <Bubbles colors={colors} />}
				</div>
			</ViewportRoot>
		</div>
	);
}

function ColorPickerCanvas({
	image: imageModel,
	onColor,
	className,
	onPickingChange,
}: {
	image: EntityFile;
	onColor: (init: ProjectColorsItemInit) => void;
	className?: string;
	onPickingChange?: (picking: boolean) => void;
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

	const getCanvasColor = useCallback(
		(x: number, y: number) => {
			const canvas = canvasRef.current;
			if (!canvas) return null;
			const ctx = canvas.getContext('2d');
			if (!ctx) return null;

			const pixel = ctx.getImageData(x, y, 1, 1).data;

			const color = { r: pixel[0], g: pixel[1], b: pixel[2] };
			return color;
		},
		[canvasRef],
	);

	return (
		<CanvasRoot canvas={logicalCanvas}>
			{/* <CanvasBackground> */}
			<canvas ref={canvasRef} className={clsx('touch-none', className)} />
			{/* </CanvasBackground> */}
			{/* bubble preview */}
			<BubblePicker
				getCanvasColor={getCanvasColor}
				onPickingChange={onPickingChange}
				onColor={onColor}
			/>
		</CanvasRoot>
	);
}

function BubblePicker({
	getCanvasColor,
	onPickingChange,
	onColor,
}: {
	getCanvasColor: (
		x: number,
		y: number,
	) => { r: number; g: number; b: number } | null;
	onPickingChange?: (picking: boolean) => void;
	onColor: (color: {
		value: { r: number; g: number; b: number };
		percentage: { x: number; y: number };
		pixel: { x: number; y: number };
	}) => void;
}) {
	const previewRef = useRef<HTMLDivElement>(null);

	useClaimGesture(
		'tool',
		'bubble',
		(detail) => {
			console.log('detail', detail);
			return detail.isTouch || detail.isLeftMouse;
		},
		{
			onCanvas: true,
		},
	);

	const canvas = useCanvas();

	useClaimedGestures(
		{
			onDragStart: ({ pointerWorldPosition }) => {
				const { x, y } = pointerWorldPosition;
				const preview = previewRef.current;
				if (!preview) return;
				preview.style.setProperty('left', `${x}px`);
				preview.style.setProperty('top', `${y}px`);
				preview.style.setProperty('display', 'block');
				const color = getCanvasColor(x, y);
				if (!color) return;
				preview.style.setProperty(
					'background-color',
					`rgb(${color.r}, ${color.g}, ${color.b})`,
				);
				onPickingChange?.(true);
			},
			onDrag: ({ pointerWorldPosition }) => {
				const { x, y } = pointerWorldPosition;
				const preview = previewRef.current;
				if (!preview) return;
				preview.style.setProperty('left', `${x}px`);
				preview.style.setProperty('top', `${y}px`);

				const color = getCanvasColor(x, y);
				if (!color) return;
				preview.style.setProperty(
					'background-color',
					`rgb(${color.r}, ${color.g}, ${color.b})`,
				);
			},
			onDragEnd: ({ pointerWorldPosition }) => {
				const { x, y } = pointerWorldPosition;

				previewRef.current?.style.setProperty('display', 'none');
				onPickingChange?.(false);

				const canvasRect = canvas.limits.value;
				const canvasWidth = canvasRect.max.x - canvasRect.min.x;
				const canvasHeight = canvasRect.max.y - canvasRect.min.y;
				const canvasX = x / canvasWidth;
				const canvasY = y / canvasHeight;

				const color = getCanvasColor(x, y);
				if (!color) return;

				onColor({
					value: color,
					percentage: { x: canvasX, y: canvasY },
					pixel: { x, y },
				});
			},
		},
		'bubble',
	);

	return (
		<div
			ref={previewRef}
			className="translate-[calc(4px/var(--zoom,1))] rounded-r-full rounded-bl-full w-[calc(84px/var(--zoom,1))] h-[calc(84px/var(--zoom,1))] fixed pointer-events-none"
		/>
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
				'absolute rounded-full pointer-events-auto -translate-1/2 border-solid border-1 border-black appearance-none min-h-0 min-w-0 p-0 m-0',
				selected && 'border-2 border-black z-1',
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
