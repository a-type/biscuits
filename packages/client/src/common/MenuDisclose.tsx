import { Button, ButtonProps, clsx, SlotDiv, SlotDivProps } from '@a-type/ui';
import { createContext, forwardRef, useContext, useState } from 'react';
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

export interface MenuDiscloseRootProps extends SlotDivProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const MenuDiscloseRoot = forwardRef<
	HTMLDivElement,
	MenuDiscloseRootProps
>(function MenuDiscloseRootImpl(
	{ children, open: userOpen, onOpenChange, className, ...rest },
	ref,
) {
	const [internalOpen, setInternalOpen] = useState(false);

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
			<SlotDiv
				{...rest}
				ref={finalRef as any}
				className={clsx('relative', 'menu-disclose-root', className)}
			>
				{children}
				{open && (
					<div className="opacity-0 bg-overlay fixed inset-0 z-0 pointer-events-none animate-fade-in animate-delay-200 animate-forwards" />
				)}
			</SlotDiv>
		</MenuDiscloseContext.Provider>
	);
});

export interface MenuDiscloseTriggerProps extends Omit<ButtonProps, 'color'> {}

export const MenuDiscloseTrigger = forwardRef<
	HTMLButtonElement,
	MenuDiscloseTriggerProps
>(function MenuDiscloseTriggerImpl({ children, ...rest }, ref) {
	const { setOpen, open } = useContext(MenuDiscloseContext);

	return (
		<DefaultButton
			{...rest}
			ref={ref}
			className={clsx(
				'pointer-events-auto',
				'menu-disclose-trigger',
				'bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-auto',
				open && 'menu-disclose-trigger-hidden',
			)}
			onClick={(ev) => {
				setOpen(!open);
				rest.onClick?.(ev as any);
			}}
		>
			{children}
		</DefaultButton>
	);
});

function DefaultButton({ className, ...props }: ButtonProps) {
	return (
		<Button
			emphasis="primary"
			className={clsx('absolute shadow-xl', className)}
			{...props}
		/>
	);
}

export interface MenuDiscloseContentProps extends SlotDivProps {}

export const MenuDiscloseContent = forwardRef<
	HTMLDivElement,
	MenuDiscloseContentProps
>(function MenuDiscloseContentImpl({ children, className, ...rest }, ref) {
	const { open } = useContext(MenuDiscloseContext);
	const [disableAnimation, setDisableAnimation] = useState(true);
	if (disableAnimation && open) {
		setDisableAnimation(false);
	}

	return (
		<SlotDiv
			{...rest}
			ref={ref}
			className={clsx(
				'relative z-1 border-default bg-white rounded-lg shadow-xl',
				'menu-disclose-content',
				open ?
					'menu-disclose-content-visible pointer-events-auto'
				:	'menu-disclose-content-hidden pointer-events-none',
				disableAnimation && 'disable-animation',
				className,
			)}
		>
			{children}
		</SlotDiv>
	);
});

export const MenuDisclose = Object.assign(MenuDiscloseRoot, {
	Content: MenuDiscloseContent,
	Trigger: MenuDiscloseTrigger,
});
