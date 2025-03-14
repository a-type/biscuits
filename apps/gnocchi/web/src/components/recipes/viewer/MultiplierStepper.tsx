import { NumberStepper, NumberStepperProps } from '@a-type/ui';
import { fractionToText } from '@a-type/utils';
import { Cross1Icon } from '@radix-ui/react-icons';

export interface MultiplierStepperProps extends NumberStepperProps {
	value: number;
	onChange: (value: number) => void;
}

const STEPS = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function MultiplierStepper(props: MultiplierStepperProps) {
	return (
		<NumberStepper
			{...props}
			steps={STEPS}
			renderValue={(value) => (
				<>
					<Cross1Icon style={{ width: 10, height: 10 }} />{' '}
					{fractionToText(value)}
				</>
			)}
		/>
	);
}
