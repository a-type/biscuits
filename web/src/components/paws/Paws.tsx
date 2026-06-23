import classes from './Paws.module.css';

export interface PawsProps {}

export function Paws({}: PawsProps) {
	return (
		<div className={classes.container}>
			<div className={classes.driftLayer} aria-hidden>
				<img
					src="/animations/paws1-v.001.png"
					className={`${classes.frame} ${classes.frame1}`}
				/>
				<img
					src="/animations/paws1-v.002.png"
					className={`${classes.frame} ${classes.frame2}`}
				/>
			</div>
		</div>
	);
}

export default Paws;
