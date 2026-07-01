import {
	TextLink as BaseTextLink,
	Button,
	ButtonProps,
	clsx,
} from '@a-type/ui';
import { Link, LinkProps } from '@verdant-web/react-router';
import { forwardRef } from 'react';
import cls from './Link.module.css';

export { Link };
export type { LinkProps };

export interface LinkButtonProps extends LinkProps {
	color?: ButtonProps['color'];
	size?: ButtonProps['size'];
	emphasis?: ButtonProps['emphasis'];
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
	function LinkButton({ className, color, size, emphasis, ...props }, ref) {
		return (
			<Button
				render={
					<Link
						ref={ref}
						className={clsx(cls.linkButton, className)}
						{...props}
					/>
				}
				color={color}
				size={size}
				emphasis={emphasis}
			/>
		);
	},
);

export const TextLink = forwardRef<HTMLAnchorElement, LinkProps>(
	function TextLink({ className, ...props }, ref) {
		return (
			<BaseTextLink
				render={
					<Link
						{...props}
						className={clsx(cls.textLink, className)}
						ref={ref}
					/>
				}
			/>
		);
	},
);
