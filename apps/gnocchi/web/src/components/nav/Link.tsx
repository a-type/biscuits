import { ButtonProps, getButtonClassName } from '@a-type/ui';
import { Link, LinkProps } from '@verdant-web/react-router';
import classNames from 'classnames';
import { forwardRef } from 'react';

export { Link };
export type { LinkProps };

export interface LinkButtonProps extends LinkProps {
	color?: ButtonProps['color'];
	size?: ButtonProps['size'];
	align?: ButtonProps['align'];
	emphasis?: ButtonProps['emphasis'];
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
	function LinkButton(
		{ className, color, size, align, emphasis, ...props },
		ref,
	) {
		return (
			<Link
				className={classNames(
					getButtonClassName({ color, size, align, emphasis }),
					'[&[data-transitioning=true]]:opacity-70',
					className,
				)}
				{...props}
				ref={ref}
			/>
		);
	},
);

export const TextLink = forwardRef<HTMLAnchorElement, LinkProps>(
	function TextLink({ className, ...props }, ref) {
		return (
			<Link
				{...props}
				className={classNames(
					'layer-components:([&[data-transitioning=true]]:opacity-70 font-bold cursor-pointer text-gray9)',
					className,
				)}
				ref={ref}
			/>
		);
	},
);
