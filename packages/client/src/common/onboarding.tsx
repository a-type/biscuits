import {
	Button,
	clsx,
	CollapsibleContent,
	CollapsibleRoot,
	Icon,
	Popover,
	PopoverAnchor,
	PopoverArrow,
	PopoverContent,
} from '@a-type/ui';
import { ReactNode, useCallback, useEffect, useId, useState } from 'react';
import { proxy, subscribe, useSnapshot } from 'valtio';
import { useEffectOnce } from '../hooks/useEffectOnce.js';

type StringTuple = readonly string[];
export type Onboarding<Steps extends StringTuple> = {
	useBegin: () => () => void;
	useSkip: () => () => void;
	useStep: (
		name: Steps[number],
	) => readonly [boolean, () => void, boolean, boolean];
	useCancel: () => () => void;
	begin: () => void;
	skip: () => void;
	cancel: () => void;
};

export function createOnboarding<Steps extends StringTuple>(
	name: string,
	steps: Steps,
	startImmediately?: boolean,
): Onboarding<Steps> {
	const stepUnmounted: Record<string, boolean> = {};

	const activeStateStr =
		typeof window !== 'undefined' ?
			localStorage.getItem(`onboarding-${name}`)
		:	null;
	let activeState: Steps[number] | 'complete' | null =
		startImmediately ? steps[0] : null;
	if (activeStateStr) {
		if (activeStateStr === 'complete') activeState = 'complete';
		else activeState = steps.find((step) => step === activeStateStr) ?? null;
	}

	const state = proxy({
		active: activeState,
	});

	subscribe(state, () => {
		if (typeof window !== 'undefined') {
			if (state.active) {
				localStorage.setItem(`onboarding-${name}`, state.active);
			} else {
				localStorage.removeItem(`onboarding-${name}`);
			}
		}
	});

	function useBegin() {
		return useCallback(() => {
			if (state.active === null) {
				console.debug('Begin onboarding', name);
				state.active = steps[0];
			}
		}, []);
	}
	function useSkip() {
		return useCallback(() => {
			state.active = 'complete';
		}, []);
	}

	const stepClaims: Record<string, string> = {};

	function useStep(name: Steps[number], disableNextOnUnmount = false) {
		// a unique ID for this invocation of this hook. useful if there
		// are multiple mounted components using this same hook and name.
		const id = useId();
		const hasClaim = stepClaims[name] === id;
		useEffect(() => {
			if (!stepClaims[name]) {
				stepClaims[name] = id;
				return () => {
					delete stepClaims[name];
				};
			}
		}, [id]);

		const active = useSnapshot(state).active;

		const next = useCallback(() => {
			if (state.active !== name) return;
			const index = steps.indexOf(name);
			if (index === steps.length - 1) {
				state.active = 'complete';
			} else {
				state.active = steps[index + 1];
			}
		}, [name]);

		const isLast = steps.indexOf(name) === steps.length - 1;
		const isOnly = steps.length === 1;

		useEffectOnce(() => {
			if (!hasClaim) return;

			stepUnmounted[name] = false;

			if (disableNextOnUnmount) {
				return;
			}

			return () => {
				stepUnmounted[name] = true;
				setTimeout(() => {
					if (stepUnmounted[name]) {
						next();
					}
				}, 1000);
			};
		});

		return [active === name && hasClaim, next, isLast, isOnly] as const;
	}
	function useCancel() {
		return useCallback(() => {
			state.active = null;
		}, []);
	}

	return {
		useBegin,
		useSkip,
		useStep,
		useCancel,
		begin: () => {
			if (state.active === null) {
				state.active = steps[0];
			}
		},
		skip: () => {
			state.active = 'complete';
		},
		cancel: () => {
			state.active = null;
		},
	};
}

export type OnboardingStep<O extends Onboarding<any>> =
	O extends Onboarding<infer S> ? S[number] : never;

export interface OnboardingBannerProps<O extends Onboarding<any>> {
	onboarding: O;
	step: O extends Onboarding<infer S> ? S[number] : never;
	children: ReactNode;
	className?: string;
	disableNext?: boolean;
}

export function OnboardingBanner<O extends Onboarding<any>>({
	onboarding,
	step,
	children,
	className,
	disableNext,
}: OnboardingBannerProps<O>) {
	const [show, next, isLast, isOnly] = onboarding.useStep(step);
	const id = useId();

	return (
		<CollapsibleRoot
			open={show}
			className={clsx('theme-leek', 'w-full', className)}
		>
			<CollapsibleContent>
				<div className="flex flex-col w-full bg-primary-wash color-black p-4 rounded-lg gap-3">
					<div>{children}</div>
					<div className="flex justify-end gap-3">
						{!disableNext && (
							<Button emphasis="ghost" onClick={next}>
								{isLast ?
									isOnly ?
										'Ok'
									:	'Finish'
								:	'Next'}
							</Button>
						)}
					</div>
				</div>
			</CollapsibleContent>
		</CollapsibleRoot>
	);
}

export interface OnboardingTooltipProps<O extends Onboarding<any>> {
	onboarding: O;
	step: O extends Onboarding<infer S> ? S[number] : never;
	children: ReactNode;
	className?: string;
	disableNext?: boolean;
	content: ReactNode;
	/** Pass a filter to ignore interactions for auto-next */
	ignoreOutsideInteraction?: (target: HTMLElement) => boolean;
}

export const OnboardingTooltip = function OnboardingTooltip<
	O extends Onboarding<any>,
>({
	onboarding,
	step,
	children,
	disableNext,
	content,
	ignoreOutsideInteraction,
}: OnboardingTooltipProps<O>) {
	const [show, next, isLast] = onboarding.useStep(step);

	// delay
	const [delayedOpen, setDelayedOpen] = useState(false);
	useEffect(() => {
		if (show) {
			const timeout = setTimeout(() => {
				setDelayedOpen(true);
			}, 500);
			return () => clearTimeout(timeout);
		}
	}, [show]);

	return (
		<Popover open={delayedOpen && show} modal={false}>
			<PopoverAnchor asChild>{children}</PopoverAnchor>
			<PopoverContent
				disableBlur
				className={clsx(
					'theme-leek',
					'bg-primary-wash flex py-2 px-3',
					'overflow-visible',
				)}
				onInteractOutside={(event) => {
					// if the user interacts outside the popover,
					// and it's with anything besides a button or input,
					// go to the next step
					const target = event.target as HTMLElement;
					if (!ignoreOutsideInteraction || !ignoreOutsideInteraction(target)) {
						next();
					}
				}}
				collisionPadding={16}
			>
				<PopoverArrow className="!fill-primary-wash" />
				<div className="flex flex-row gap-3 items-center">
					{content}
					{!disableNext && (
						<Button
							emphasis={isLast ? 'primary' : 'ghost'}
							size="small"
							onClick={next}
						>
							{isLast ? 'Finish' : <Icon name="x" />}
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
};
