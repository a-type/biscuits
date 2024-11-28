import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';

export interface FooterProps {
	className?: string;
}

export function Footer({ className }: FooterProps) {
	return (
		<div
			className={classNames(
				'flex flex-row gap-3 justify-between items-start text-xs pt-8 pb-4 opacity-50 hover:opacity-100 w-full',
				className,
			)}
		>
			<div className="flex flex-col gap-3 items-start">
				<Link to="/" className="font-fancy text-sm font-semibold">
					Biscuits
				</Link>
				<span>© {new Date().getFullYear()} Grant Forrest</span>
				<Link to="/privacy">Privacy Policy</Link>
				<Link to="/tos">Terms of Service</Link>
			</div>
			<div className="flex flex-col gap-3 items-end">
				<Link to="/contact">Contact</Link>
				<span>Made in Raleigh, NC</span>
			</div>
		</div>
	);
}
