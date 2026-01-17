import {
	Box,
	Button,
	clsx,
	CollapsibleContent,
	CollapsibleRoot,
	Icon,
	Popover,
	PopoverArrow,
	PopoverContent,
	SlotDiv,
} from '@a-type/ui';
import {
	ReactElement,
	ReactNode,
	useCallback,
	useDebugValue,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { proxy, subscribe, useSnapshot } from 'valtio';
import { useEffectOnce } from '../hooks/useEffectOnce.js';

type StringTuple = readonly string[];
export type Onboarding<Steps extends StringTuple> = {
	useBegin: () => () => void;
	useSkip: () => () => void;
	useStep: (
		name: Steps[number],
	) => readonly [boolean, () => void, boolean, boolean, { id: string }];
	useNext: (name: Steps[number]) => () => void;
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
		stepClaims: {} as Record<string, string>,
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
	function useNext(name: Steps[number]) {
		const next = useCallback(() => {
			if (state.active !== name) return;
			const index = steps.indexOf(name);
			if (index === steps.length - 1) {
				state.active = 'complete';
			} else {
				state.active = steps[index + 1];
			}
		}, [name]);
		return next;
	}

	function useStep(name: Steps[number], disableNextOnUnmount = false) {
		// a unique ID for this invocation of this hook. useful if there
		// are multiple mounted components using this same hook and name.
		const id = useState(() => Math.random().toString(16).slice(2))[0];
		const hasClaim = useSnapshot(state.stepClaims)[name] === id;
		useLayoutEffect(() => {
			if (!state.stepClaims[name]) {
				console.debug(`Step ${name} claiming with id ${id}`);
				state.stepClaims[name] = id;
				return () => {
					console.debug(`Step ${name} releasing claim of id ${id}`);
					delete state.stepClaims[name];
				};
			} else {
				console.debug(
					`Step ${name} already claimed; not claiming with id ${id}`,
				);
			}
		});

		const active = useSnapshot(state).active;

		const next = useNext(name);

		const isLast = steps.indexOf(name) === steps.length - 1;
		const isOnly = steps.length === 1;

		useEffectOnce(() => {
			if (state.stepClaims[name] !== id) {
				console.debug(`Step ${name} (${id}) has no claim; not activating`);
				return;
			}

			stepUnmounted[name] = false;

			if (disableNextOnUnmount) {
				console.debug(
					`Step ${name} disableNextOnUnmount is true; not auto-advancing on unmount`,
				);
				return;
			}

			return () => {
				console.debug(
					`Step ${name} unmounted; auto-advancing in 1s if still unmounted`,
				);
				stepUnmounted[name] = true;
				setTimeout(() => {
					if (stepUnmounted[name]) {
						next();
					}
				}, 1000);
			};
		});

		useDebugValue(
			`Step ${name} is ${active === name && hasClaim ? 'active' : 'inactive'} with id ${id}`,
		);

		return [active === name && hasClaim, next, isLast, isOnly, { id }] as const;
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
		useNext,
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
	const [show, next, isLast, isOnly, { id }] = onboarding.useStep(step);

	return (
		<CollapsibleRoot
			open={show}
			className={clsx('theme-leek', 'w-full', className)}
			data-step-id={id}
			data-step-name={step}
		>
			<CollapsibleContent>
				<div className="w-full flex flex-col gap-3 rounded-lg p-4 color-black bg-primary-wash">
					<Box col gap="sm">
						{children}
					</Box>
					<div className="flex justify-end gap-3">
						{!disableNext && (
							<Button emphasis="light" onClick={next}>
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
	children: ReactElement;
	className?: string;
	disableNext?: boolean;
	content: ReactNode;
	/** Pass a filter to ignore interactions for auto-next */
	ignoreOutsideInteraction?: ((target: HTMLElement) => boolean) | boolean;
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

	const anchorRef = useRef<any>(null);

	return (
		<Popover
			open={delayedOpen && show}
			onOpenChange={(open, ev) => {
				if (!open) {
					// if the user interacts outside the popover,
					// and it's with anything besides a button or input,
					// go to the next step
					const ignored =
						ignoreOutsideInteraction === true ||
						(typeof ignoreOutsideInteraction === 'function' &&
							ev.event.target instanceof HTMLElement &&
							ignoreOutsideInteraction(ev.event.target));
					if (ev.reason === 'outside-press' && ignored) {
						return;
					}
					next();
				}
			}}
			modal={false}
		>
			<SlotDiv render={children} ref={anchorRef} />
			<PopoverContent
				className={clsx(
					'theme-leek',
					'flex px-3 py-2 bg-primary-wash',
					'overflow-visible',
				)}
				collisionPadding={16}
				anchor={anchorRef}
			>
				<PopoverArrow className="!fill-primary-wash" />
				<div className="flex flex-row items-center gap-3">
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
