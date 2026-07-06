import { clsx } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import classes from './Footer.module.css';

export interface FooterProps {
	className?: string;
}

export function Footer({ className }: FooterProps) {
	return (
		<div className={clsx(classes.footer, className)}>
			<div className={classes.leftCol}>
				<Link to="/" className={classes.brand}>
					Biscuits
				</Link>
				<span>© 2023-{new Date().getFullYear()} Grant Forrest</span>
				<Link to="/privacy">Privacy Policy</Link>
				<Link to="/tos">Terms of Service</Link>
			</div>
			<div className={classes.rightCol}>
				<Link to="/contact">Contact</Link>
				<span>Made in Raleigh, NC</span>
			</div>
		</div>
	);
}
