import { Button, Icon } from '@a-type/ui';
import type { Editor } from '@tiptap/core';
import { useId } from 'react';

export function InsertFile({ editor }: { editor: Editor }) {
	const id = useId();
	return (
		<>
			<Button size="icon" color="ghost" asChild>
				<label htmlFor={id}>
					<Icon name="picture" />
				</label>
			</Button>
			<input
				id={id}
				type="file"
				accept="image/*"
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (!file) return;
					editor.chain().focus().insertMedia(file).run();
					e.target.value = '';
				}}
				className="hidden"
			/>
		</>
	);
}
