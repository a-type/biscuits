import { Box, FormikForm, IconName, SubmitButton, TextField } from '@a-type/ui';
import { ColorPicker } from './ColorPicker.js';

export interface TagCreateFormProps {
	onCreate: (init: {
		name: string;
		color?: string;
		icon?: IconName;
	}) => void | Promise<void>;
	className?: string;
	defaultColor?: string;
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
					<Box gap items="end" full="width">
						<TextField name="name" label="New tag" style={{ flex: '1 0 0' }} />
						<Box style={{ flexBasis: 'auto' }}>
							<ColorPicker
								onValueChange={(v) => setFieldValue('color', v)}
								value={values.color ?? defaultColor ?? null}
							/>
						</Box>
					</Box>
					<Box justify="end" full="width">
						<SubmitButton emphasis="light" type="submit">
							Create
						</SubmitButton>
					</Box>
				</>
			)}
		</FormikForm>
	);
}
