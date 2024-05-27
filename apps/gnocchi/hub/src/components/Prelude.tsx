'use client';

import { Peek } from '@a-type/ui/components/peek';
import { RichEditor } from '@a-type/ui/components/richEditor';
// @ts-ignore
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { clsx } from '@a-type/ui';

export interface PreludeProps {
  content: any;
}

export function Prelude({ content }: PreludeProps) {
  const editor = useEditor({
    extensions: [StarterKit.configure({}), Link],
    content,
    editable: false,
  });
  return (
    <Peek peekHeight={400}>
      <div className={clsx('p-summary', 'pb-4')} itemProp="description">
        <RichEditor editor={editor} readOnly />
      </div>
    </Peek>
  );
}
