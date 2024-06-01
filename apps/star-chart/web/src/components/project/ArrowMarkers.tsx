import { SvgPortal } from '../canvas/CanvasSvgLayer.jsx';

export interface ArrowMarkersProps {}

export function ArrowMarkers({}: ArrowMarkersProps) {
  return (
    <defs>
      <marker
        id="arrow-start"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
      </marker>
      <marker
        id="arrow-end"
        viewBox="0 0 10 10"
        refX="0"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
      </marker>
    </defs>
  );
}
