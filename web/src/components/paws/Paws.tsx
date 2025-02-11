import './paws.css';

export interface PawsProps {}

export function Paws({}: PawsProps) {
	return (
		<div className="absolute right-0 bottom-0 w-full max-w-[300px] aspect-ratio-9/16 overflow-hidden">
			<div className="absolute left-0 bottom-0 w-full h-full drift" aria-hidden>
				<img
					src="/animations/paws1-v.001.png"
					className="absolute right-0 top-0 w-full object-bl frame-1"
				/>
				<img
					src="/animations/paws1-v.002.png"
					className="absolute right-0 top-0 w-full object-bl frame-2"
				/>
			</div>
		</div>
	);
}

export default Paws;
