import cls from './Connector.module.css';

export interface ConnectorProps {
	type: 'straight' | 'angle';
}

export function Connector({ type }: ConnectorProps) {
	if (type === 'angle') return <AngleConnector />;
	if (type === 'straight') return <StraightConnector />;
	return null;
}

function AngleConnector() {
	return (
		<svg
			width="48"
			height="24"
			viewBox="0 0 48 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={cls.root}
		>
			<path
				d="M 40 0 v 6 a 6 6 0 0 1 -6 6 H 14 a 6 6 0 0 0 -6 6 v 6"
				stroke="currentColor"
				strokeWidth="2"
			/>
		</svg>
	);
}

function StraightConnector() {
	return (
		<svg
			width="10"
			height="24"
			viewBox="0 0 10 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={cls.root}
		>
			<path d="M8 0L8 24" stroke="currentColor" strokeWidth="2" />
		</svg>
	);
}
