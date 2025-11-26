import configureMeasurements, {
	length,
	mass,
	pieces,
	UnitDescription,
	volume,
} from 'convert-units';

export const convert = configureMeasurements({
	// @ts-ignore
	volume,
	// @ts-ignore
	mass,
	// @ts-ignore
	pieces,
	// @ts-ignore
	length,
});

export function lookupUnit(unitName: string | null): UnitDescription | null {
	if (!unitName) return null;
	const units = convert().list();
	// @ts-ignore
	const match = units.find(function ({ abbr, singular, plural }) {
		return (
			unitName.toLowerCase() === abbr ||
			unitName.toLowerCase() === singular.toLowerCase() ||
			unitName.toLowerCase() === plural.toLowerCase() ||
			unitName.toLowerCase() === translateBritish(singular.toLowerCase())
		);
	});
	return match || null;
}

function translateBritish(word: string) {
	if (word.endsWith('re')) {
		return word.slice(0, -2) + 'er';
	}
}
