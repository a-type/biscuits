import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';
import { useStableCallback } from '@biscuits/client';
import {
  Project,
  ProjectColors,
  ProjectColorsItem,
  ProjectColorsItemInit,
} from '@palette.biscuits/verdant';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useColorSelection } from './hooks.js';
import { preventDefault } from '@a-type/utils';
import { useGesture } from '@use-gesture/react';

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
  hooks.useWatch(image);
  const [_, setSelected] = useColorSelection();
  const addColor = (init: ProjectColorsItemInit) => {
    colors.push(init);
    const newColor = colors.get(colors.length - 1);
    setSelected(newColor.get('id'));
  };
  const [picking, setPicking] = useState(false);

  return (
    <div className={clsx('relative w-full sm:(w-auto h-full)', className)}>
      <div className="relative">
        <ColorPickerCanvas
          imageSrc={image.url}
          onColor={addColor}
          onPickingChange={setPicking}
        />
        {showBubbles && !picking && <Bubbles colors={colors} />}
      </div>
    </div>
  );
}

function ColorPickerCanvas({
  imageSrc,
  onColor,
  className,
  onPickingChange,
}: {
  imageSrc?: string | null;
  onColor: (init: ProjectColorsItemInit) => void;
  className?: string;
  onPickingChange?: (picking: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!imageSrc) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      // enforce aspect ratio
      canvas.style.setProperty(
        'aspect-ratio',
        `${image.width}/${image.height}`,
      );
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    };
  }, [canvasRef, imageSrc]);

  const getCanvasColor = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // convert from mouse position into canvas pixels, have to use canvas actual size
      const canvasRect = canvas.getBoundingClientRect();
      const canvasX = (x - canvasRect.left) * (canvas.width / canvasRect.width);
      const canvasY =
        (y - canvasRect.top) * (canvas.height / canvasRect.height);

      const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;

      const color = { r: pixel[0], g: pixel[1], b: pixel[2] };
      return color;
    },
    [canvasRef],
  );

  useGesture(
    {
      onDragStart: ({ xy }) => {
        const [clientX, clientY] = xy;
        const preview = previewRef.current;
        if (!preview) return;
        preview.style.setProperty('left', `${clientX}px`);
        preview.style.setProperty('top', `${clientY}px`);
        preview.style.setProperty('display', 'block');
        const color = getCanvasColor(clientX, clientY);
        if (!color) return;
        preview.style.setProperty(
          'background-color',
          `rgb(${color.r}, ${color.g}, ${color.b})`,
        );
        onPickingChange?.(true);
      },
      onDrag: ({ xy }) => {
        const [clientX, clientY] = xy;
        const preview = previewRef.current;
        if (!preview) return;
        preview.style.setProperty('left', `${clientX}px`);
        preview.style.setProperty('top', `${clientY}px`);

        const color = getCanvasColor(clientX, clientY);
        if (!color) return;
        preview.style.setProperty(
          'background-color',
          `rgb(${color.r}, ${color.g}, ${color.b})`,
        );
      },
      onDragEnd: ({ xy }) => {
        const [clientX, clientY] = xy;

        previewRef.current?.style.setProperty('display', 'none');
        onPickingChange?.(false);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // convert from mouse position into canvas pixels, have to use canvas actual size
        const canvasRect = canvas.getBoundingClientRect();
        const canvasX =
          (clientX - canvasRect.left) * (canvas.width / canvasRect.width);
        const canvasY =
          (clientY - canvasRect.top) * (canvas.height / canvasRect.height);

        const color = getCanvasColor(clientX, clientY);
        if (!color) return;

        onColor({
          value: color,
          percentage: { x: canvasX / canvas.width, y: canvasY / canvas.height },
          pixel: { x: canvasX, y: canvasY },
        });
      },
    },
    {
      eventOptions: {
        capture: true,
        passive: false,
      },
      drag: {
        pointer: {
          touch: true,
        },
      },
      target: canvasRef,
    },
  );

  return (
    <>
      <canvas
        ref={canvasRef}
        className={clsx(
          'w-full h-auto sm:(w-auto h-full max-w-60vw) touch-none',
          className,
        )}
        onContextMenu={preventDefault}
      />
      {/* bubble preview */}
      <div
        ref={previewRef}
        className="-translate-1/2 rounded-full w-120px h-120px fixed pointer-events-none"
      />
    </>
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
        'absolute w-24px h-24px rounded-full pointer-events-auto -translate-1/2 border-solid border-0 appearance-none',
        selected && 'border-2 border-black w-48px h-48px z-1',
      )}
      style={{
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
        left: `${x * 100}%`,
        top: `${y * 100}%`,
      }}
    />
  );
}
