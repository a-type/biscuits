import { Tooltip } from '@a-type/ui';
import { fractionToText } from '@a-type/utils';

export interface TextWithMultipliedNumbersProps {
	text: string | null;
	multiplier: number;
}

// This regex matches any number with a decimal point, or any number with a fraction.
// however, if the number ends with a degree symbol, or "F" or "C", it does not match
// any part of it. for example, "350F" would not match, but "350" would.
// but also "350F" would not match "35"... but also "45cans" would match.
const numberRegex = /(\d+\.\d+|\d+\/\d+|\d+)(?!\d*\s*[FC°])/g;

export function TextWithMultipliedNumbers({
	text,
	multiplier,
}: TextWithMultipliedNumbersProps) {
	if (multiplier === 1) return <>{text}</>;
	if (!text) return <>{text}</>;

	const matches = text.match(numberRegex);
	if (!matches) return <>{text}</>;
	const fragments = text.trim().split(numberRegex);

	return (
		<>
			{fragments.map((fragment, index) => {
				const isNumber = numberRegex.test(fragment);
				return (
					<span key={index}>
						{!isNumber && fragment}
						{isNumber && (
							<Tooltip
								content={
									(
										<span className="max-w-80dvw text-wrap">
											Multiplier {fractionToText(multiplier)}x applied. Original
											value: {fragment}
										</span>
									) as any
								}
							>
								<span className="multiplied-number inline-flex flex-row items-center gap-0.5 font-bold color-accent-dark">
									{fractionToText(parseFloat(fragment.trim()) * multiplier)}
								</span>
							</Tooltip>
						)}
					</span>
				);
			})}
		</>
	);
}
