import {
	TextLink as BaseTextLink,
	Button,
	ButtonProps,
	clsx,
} from '@a-type/ui';
import { Link, LinkProps, type NavigateOptions } from '@tanstack/react-router';
import { forwardRef } from 'react';
import cls from './Link.module.css';

export { BaseTextLink, Link, NavigateOptions };
export type { LinkProps };

export interface WrappedLinkProps extends LinkProps<'a'> {
	className?: string;
	newTab?: boolean;
	onClick?: () => void;
}

export interface LinkButtonProps extends WrappedLinkProps {
	color?: ButtonProps['color'];
	size?: ButtonProps['size'];
	emphasis?: ButtonProps['emphasis'];
}

function getNewTabProps(newTab?: boolean) {
	if (newTab) {
		return {
			target: '_blank',
			rel: 'noopener noreferrer',
		};
	}
	return {};
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
	function LinkButton(
		{ className, color, size, emphasis, newTab, ...props },
		ref,
	) {
		return (
			<Button
				render={
					<Link
						ref={ref}
						className={clsx(cls.linkButton, className)}
						{...getNewTabProps(newTab)}
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

export interface TextLinkProps extends WrappedLinkProps {}

export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
	function TextLink({ className, newTab, ...props }, ref) {
		return (
			<BaseTextLink
				render={
					<Link
						ref={ref}
						{...getNewTabProps(newTab)}
						className={clsx(cls.textLink, className)}
						{...props}
					/>
				}
			/>
		);
	},
);
