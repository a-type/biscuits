import { createContext, useContext, useState } from 'react';
import { Canvas, CanvasOptions } from './Canvas.js';
import { useCanvasGestures } from './canvasHooks.js';

// A 'default' implementation of CanvasContext which essentially does nothing,
// might assist in easier isolated rendering of canvas-dependent components
const dummyCanvas = new Canvas({});

export const CanvasContext = createContext<Canvas>(dummyCanvas);

export function useCreateCanvas(options?: CanvasOptions) {
	return useState(() => new Canvas(options))[0];
}

export const useCanvas = () => useContext(CanvasContext);

// FIXME: this is silly, clean this pattern up
export function CanvasGestures(props: Parameters<typeof useCanvasGestures>[0]) {
	useCanvasGestures(props);
	return null;
}
