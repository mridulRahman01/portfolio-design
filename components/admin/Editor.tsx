'use client';

import { useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';

/**
 * Tiptap rich text editor.
 * StarterKit covers headings, paragraphs, bold/italic/strike, lists,
 * blockquotes, code blocks and horizontal rules.
 * Images upload straight to Cloudinary; videos embed from YouTube URLs.
 */
export function Editor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Image.configure({ HTMLAttributes: { class: 'rounded-xl' } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Write your article…' }),
      Youtube.configure({
        nocookie: true,
        HTMLAttributes: { class: 'yt-embed' },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'tiptap-content min-h-[320px] px-4 py-3 outline-none text-[15px] leading-relaxed text-white/85',
      },
    },
  });

  /** Upload picked file(s) to Cloudinary, then insert into the article. */
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length || !editor) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', file);
        form.append('folder', 'blog');
        const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? 'Upload failed');
        editor.chain().focus().setImage({ src: json.media.url, alt: file.name }).run();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [editor]);

  const addVideo = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('YouTube video URL:', 'https://www.youtube.com/watch?v=');
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL:', prev ?? 'https://');
    if (url === null) return;
    if (url === '') editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return <div className="min-h-[320px] rounded-xl border border-white/10 bg-black/30 animate-pulse" />;
  }

  const btn = (active: boolean) =>
    `rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-150 active:scale-90 ${
      active ? 'bg-[#00F5B8]/15 text-[#00F5B8]' : 'text-white/55 hover:bg-white/[0.06] hover:text-white'
    }`;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30 transition-colors focus-within:border-[#00F5B8]/40">
      <input
        ref={fileRef} type="file" accept="image/*" multiple hidden
        onChange={e => handleFiles(e.target.files)}
      />
      <div className="flex flex-wrap gap-1 border-b border-white/8 bg-white/[0.02] px-2 py-2" role="toolbar" aria-label="Formatting">
        <button type="button" className={btn(editor.isActive('heading', { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={btn(editor.isActive('heading', { level: 3 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" className={btn(editor.isActive('bold'))}
          onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
        <button type="button" className={btn(editor.isActive('italic'))}
          onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
        <button type="button" className={btn(editor.isActive('strike'))}
          onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>
        <span className="mx-1 w-px bg-white/10" aria-hidden />
        <button type="button" className={btn(editor.isActive('bulletList'))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" className={btn(editor.isActive('orderedList'))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" className={btn(editor.isActive('blockquote'))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo; Quote</button>
        <button type="button" className={btn(editor.isActive('codeBlock'))}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{'</>'}</button>
        <span className="mx-1 w-px bg-white/10" aria-hidden />
        <button type="button" className={btn(editor.isActive('link'))} onClick={setLink}>Link</button>
        <button
          type="button"
          className={`${btn(false)} ${uploading ? 'opacity-50' : ''}`}
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? 'Uploading…' : '🖼 Image'}
        </button>
        <button type="button" className={btn(false)} onClick={addVideo}>▶ Video</button>
        <button type="button" className={btn(false)}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</button>
        <span className="mx-1 w-px bg-white/10" aria-hidden />
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().undo().run()}>↶</button>
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().redo().run()}>↷</button>
      </div>
      {error && (
        <p className="border-b border-red-500/20 bg-red-500/10 px-4 py-2 text-xs text-red-300">{error}</p>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
