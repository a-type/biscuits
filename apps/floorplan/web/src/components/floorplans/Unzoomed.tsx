import { Slot, withClassName } from '@a-type/ui';

function GSlot({
	children,
	asChild,
	...rest
}: {
	children: React.ReactNode;
	asChild?: boolean;
}) {
	if (asChild) {
		return <Slot {...rest}>{children}</Slot>;
	}
	return <g {...rest}>{children}</g>;
}

export const Unzoomed = withClassName(
	GSlot,
	'scale-[calc(1/var(--zoom-settled))]',
);
