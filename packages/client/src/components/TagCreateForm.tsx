import {
	Box,
	ColorPicker,
	FormikForm,
	IconName,
	SubmitButton,
	TextField,
	ThemeName,
} from '@a-type/ui';

export interface TagCreateFormProps {
	onCreate: (init: {
		name: string;
		color?: ThemeName;
		icon?: IconName;
	}) => void | Promise<void>;
	className?: string;
	defaultColor?: ThemeName;
}

export function TagCreateForm({
	onCreate,
	className,
	defaultColor,
}: TagCreateFormProps) {
	return (
		<FormikForm
			initialValues={{
				name: '',
				color: undefined,
				icon: undefined,
			}}
			onSubmit={async (values, bag) => {
				await onCreate({
					...values,
					name: values.name.trim().toLowerCase(),
				});
				bag.resetForm();
			}}
			className={className}
		>
			{({ setFieldValue, values }) => (
				<>
					<Box gap items="end" className="w-full">
						<TextField name="name" label="New tag" className="flex-1-0-0" />
						<Box className="flex-basis-auto">
							<ColorPicker
								onChange={(v) => setFieldValue('color', v)}
								value={values.color ?? defaultColor ?? null}
							/>
						</Box>
					</Box>
					<Box justify="end" className="w-full">
						<SubmitButton type="submit">Create</SubmitButton>
					</Box>
				</>
			)}
		</FormikForm>
	);
}
