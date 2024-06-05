import { CommonGestureState, SharedGestureState } from '@use-gesture/react';
import { CanvasGestureInput } from './Canvas.js';

type GestureState = CommonGestureState &
  SharedGestureState & { xy: [number, number] };

export function gestureStateToInput(state: GestureState): CanvasGestureInput {
  return {
    screenPosition: { x: state.xy[0], y: state.xy[1] },
    alt: state.altKey,
    shift: state.shiftKey,
    ctrlOrMeta: state.ctrlKey || state.metaKey,
    intentional: state.intentional,
    delta: { x: state.delta[0], y: state.delta[1] },
  };
}

export function applyGestureState(
  input: CanvasGestureInput,
  state: GestureState,
) {
  Object.assign(input, gestureStateToInput(state));
}
