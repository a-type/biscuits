import './paws.css';

export interface PawsProps {}

export function Paws({}: PawsProps) {
	return (
		<div className="absolute bottom-0 right-0 aspect-ratio-9/16 max-w-[50%] w-full overflow-hidden md:max-w-[300px]">
			<div className="drift absolute bottom-0 left-0 h-full w-full" aria-hidden>
				<img
					src="/animations/paws1-v.001.png"
					className="frame-1 absolute right-0 top-0 w-full object-bl"
				/>
				<img
					src="/animations/paws1-v.002.png"
					className="frame-2 absolute right-0 top-0 w-full object-bl"
				/>
			</div>
		</div>
	);
}

export default Paws;
