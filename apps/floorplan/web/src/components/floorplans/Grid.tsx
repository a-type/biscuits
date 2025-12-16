import { Unzoomed } from './Unzoomed.jsx';

export function Grid() {
	return (
		<Unzoomed>
			<line x1={-1} y1={0} x2={1} y2={0} stroke="black" strokeWidth={0.1} />
			<line x1={0} y1={-1} x2={0} y2={1} stroke="black" strokeWidth={0.1} />
		</Unzoomed>
	);
}
