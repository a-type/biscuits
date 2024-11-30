import { clsx, Slot } from '@a-type/ui';
import {
	ComponentProps,
	createContext,
	forwardRef,
	useContext,
	useState,
} from 'react';
import { useMergedRef, useOnPointerDownOutside } from '../react.js';
import './MenuDisclose.css';

type MenuDiscloseContextValue = {
	open: boolean;
	setOpen: (open: boolean) => void;
};
const MenuDiscloseContext = createContext<MenuDiscloseContextValue>({
	open: false,
	setOpen: () => {},
});

export interface MenuDiscloseRootProps extends ComponentProps<'div'> {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	asChild?: boolean;
}

export const MenuDiscloseRoot = forwardRef<
	HTMLDivElement,
	MenuDiscloseRootProps
>(function MenuDiscloseRootImpl(
	{ children, open: userOpen, onOpenChange, asChild, className, ...rest },
	ref,
) {
	const [internalOpen, setInternalOpen] = useState(false);
	const Comp = asChild ? Slot : 'div';

	const open = userOpen ?? internalOpen;

	const setOpen = (newOpen: boolean) => {
		if (userOpen === undefined) {
			setInternalOpen(newOpen);
		}
		onOpenChange?.(newOpen);
	};

	const outsideRef = useOnPointerDownOutside(() => {
		setOpen(false);
	});

	const finalRef = useMergedRef(ref, outsideRef);

	return (
		<MenuDiscloseContext.Provider value={{ open, setOpen }}>
			<Comp
				{...rest}
				ref={finalRef}
				className={clsx('relative', 'menu-disclose-root', className)}
			>
				{children}
			</Comp>
		</MenuDiscloseContext.Provider>
	);
});

export interface MenuDiscloseTriggerProps extends ComponentProps<'button'> {
	asChild?: boolean;
}

export const MenuDiscloseTrigger = forwardRef<
	HTMLButtonElement,
	MenuDiscloseTriggerProps
>(function MenuDiscloseTriggerImpl({ children, asChild, ...rest }, ref) {
	const { setOpen, open } = useContext(MenuDiscloseContext);

	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			{...rest}
			ref={ref}
			className={clsx(
				'pointer-events-auto',
				'menu-disclose-trigger',
				open && 'menu-disclose-trigger-hidden',
			)}
			onClick={(ev) => {
				setOpen(!open);
				rest.onClick?.(ev as any);
			}}
		>
			{children}
		</Comp>
	);
});

export interface MenuDiscloseContentProps extends ComponentProps<'div'> {
	asChild?: boolean;
}

export const MenuDiscloseContent = forwardRef<
	HTMLDivElement,
	MenuDiscloseContentProps
>(function MenuDiscloseContentImpl(
	{ children, className, asChild, ...rest },
	ref,
) {
	const { open } = useContext(MenuDiscloseContext);
	const [disableAnimation, setDisableAnimation] = useState(true);
	if (disableAnimation && open) {
		setDisableAnimation(false);
	}

	const Comp = asChild ? Slot : 'div';

	return (
		<Comp
			{...rest}
			ref={ref}
			className={clsx(
				'relative z-1',
				'menu-disclose-content',
				open ?
					'menu-disclose-content-visible pointer-events-auto'
				:	'menu-disclose-content-hidden pointer-events-none',
				disableAnimation && 'disable-animation',
				className,
			)}
		>
			{children}
		</Comp>
	);
});

export const MenuDisclose = Object.assign(MenuDiscloseRoot, {
	Content: MenuDiscloseContent,
	Trigger: MenuDiscloseTrigger,
});
