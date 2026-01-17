import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';

export interface FooterProps {
	className?: string;
}

export function Footer({ className }: FooterProps) {
	return (
		<div
			className={classNames(
				'w-full flex flex-row items-end justify-between gap-3 pb-4 pt-8 text-xs opacity-50 hover:opacity-100',
				className,
			)}
		>
			<div className="flex flex-col items-start gap-3">
				<Link to="/" className="font-fancy text-sm font-semibold">
					Biscuits
				</Link>
				<span>© 2023-{new Date().getFullYear()} Grant Forrest</span>
				<Link to="/privacy">Privacy Policy</Link>
				<Link to="/tos">Terms of Service</Link>
			</div>
			<div className="flex flex-col items-end gap-3">
				<Link to="/contact">Contact</Link>
				<span>Made in Raleigh, NC</span>
			</div>
		</div>
	);
}
