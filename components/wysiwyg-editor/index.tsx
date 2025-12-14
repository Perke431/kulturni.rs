'use client';

import { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { createSupabaseClient } from '@/lib/supabase/client';

interface WYSIWYGEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export default function WYSIWYGEditor({
  content,
  onChange,
  placeholder = 'Enter content here...',
  className = '',
}: WYSIWYGEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 ${className}`,
      },
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!editor) return;

    setUploading(true);
    try {
      const supabase = createSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      // Generate a unique name for the image
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const customName = `editor-image-${timestamp}`;

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'images');
      uploadFormData.append('customName', customName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Insert image into editor
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (err: any) {
      console.error('Image upload error:', err);
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!mounted || !editor) {
    return (
      <div className="w-full">
        <div className="flex flex-wrap gap-2 p-3 bg-white-30 border border-white-20 rounded-t-md border-b-0">
          {/* Placeholder toolbar */}
        </div>
        <div className="bg-background border border-white-20 rounded-b-md min-h-[300px] p-4">
          <div className="text-text/40">{placeholder}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-white-30 border border-white-20 rounded-t-md border-b-0">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            editor.isActive('bold')
              ? 'bg-primary text-background'
              : 'bg-white-20 text-text hover:bg-white-30'
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            editor.isActive('italic')
              ? 'bg-primary text-background'
              : 'bg-white-20 text-text hover:bg-white-30'
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            editor.isActive('strike')
              ? 'bg-primary text-background'
              : 'bg-white-20 text-text hover:bg-white-30'
          }`}
        >
          <s>S</s>
        </button>
        <div className="w-px h-6 bg-white-20 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-primary text-background'
              : 'bg-white-20 text-text hover:bg-white-30'
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-primary text-background'
              : 'bg-white-20 text-text hover:bg-white-30'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-primary text-background'
              : 'bg-white-20 text-text hover:bg-white-30'
          }`}
        >
          H3
        </button>
        <div className="w-px h-6 bg-white-20 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-primary text-background'
              : 'bg-white-20 text-text hover:bg-white-30'
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-primary text-background'
              : 'bg-white-20 text-text hover:bg-white-30'
          }`}
        >
          1. List
        </button>
        <div className="w-px h-6 bg-white-20 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-primary text-background'
              : 'bg-white-20 text-text hover:bg-white-30'
          }`}
        >
          "
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1.5 rounded text-sm font-medium transition-colors bg-white-20 text-text hover:bg-white-30"
        >
          ─
        </button>
        <div className="w-px h-6 bg-white-20 mx-1" />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageUpload(file);
            }
          }}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 rounded text-sm font-medium transition-colors bg-white-20 text-text hover:bg-white-30 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Insert Image"
        >
          {uploading ? '⏳' : '🖼️'}
        </button>
        <div className="w-px h-6 bg-white-20 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="px-3 py-1.5 rounded text-sm font-medium transition-colors bg-white-20 text-text hover:bg-white-30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="px-3 py-1.5 rounded text-sm font-medium transition-colors bg-white-20 text-text hover:bg-white-30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ↷
        </button>
      </div>

      {/* Editor Content */}
      <div className="bg-background border border-white-20 rounded-b-md focus-within:ring-2 focus-within:ring-primary">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 300px;
          padding: 1rem;
          color: inherit;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
          color: inherit;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
          color: inherit;
        }
        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
          color: inherit;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }
        .ProseMirror blockquote {
          border-left: 4px solid rgba(255, 255, 255, 0.3);
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: rgba(255, 255, 255, 0.8);
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid rgba(255, 255, 255, 0.2);
          margin: 2em 0;
        }
        .ProseMirror p {
          margin: 1em 0;
          color: inherit;
        }
        .ProseMirror strong {
          font-weight: bold;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror s {
          text-decoration: line-through;
        }
        .ProseMirror a {
          color: inherit;
          text-decoration: underline;
        }
        .ProseMirror code {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: monospace;
        }
        .ProseMirror pre {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 1em;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1em 0;
        }
        .ProseMirror img.ProseMirror-selectednode {
          outline: 2px solid rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
