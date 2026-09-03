"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Mark, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  CaseLower,
  CaseUpper,
  Code,
  Code2,
  Eraser,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TextTransform = Mark.create({
  name: "textTransform",
  addOptions() {
    return { HTMLAttributes: {} };
  },
  addAttributes() {
    return {
      transform: {
        default: "uppercase",
        parseHTML: (element) => (element as HTMLElement).style.textTransform || null,
        renderHTML: (attributes) => {
          if (!attributes.transform) return {};
          return { style: `text-transform: ${attributes.transform}` };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (element) => {
          const transform = (element as HTMLElement).style.textTransform;
          if (!transform || !["uppercase", "lowercase"].includes(transform)) return false;
          return { transform };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setTextTransform:
        (transform: string) =>
        ({ commands }) =>
          commands.setMark(this.name, { transform }),
      unsetTextTransform:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    textTransform: {
      setTextTransform: (transform: string) => ReturnType;
      unsetTextTransform: () => ReturnType;
    };
  }
}

const extensions = [
  StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
    HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
  }),
  Image.configure({ allowBase64: true }),
  TextStyle,
  TextTransform,
  Placeholder.configure({ placeholder: "Tulis isi berita…" }),
];

const HEADING_OPTIONS = [
  { value: "0", label: "Paragraf" },
  { value: "1", label: "Heading 1" },
  { value: "2", label: "Heading 2" },
  { value: "3", label: "Heading 3" },
] as const;

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  label: string;
  children: ReactNode;
}

function ToolbarButton({ onClick, active, disabled, label, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        "text-muted-foreground hover:bg-accent hover:text-foreground grid size-8 place-items-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-40",
        active && "bg-accent text-foreground"
      )}
    >
      {children}
    </button>
  );
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mode, setMode] = useState<"wysiwyg" | "html">("wysiwyg");
  const [htmlSource, setHtmlSource] = useState(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    extensions,
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rich-text-content min-h-[280px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChangeRef.current(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor || mode === "html") return;
    if (editor.getHTML() !== value && !editor.isFocused) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor, mode]);

  const toggleMode = () => {
    if (mode === "wysiwyg") {
      setHtmlSource(editor?.getHTML() ?? "");
      setMode("html");
    } else {
      setMode("wysiwyg");
      editor?.commands.setContent(htmlSource);
      onChange(htmlSource);
    }
  };

  const toggleCase = (transform: "uppercase" | "lowercase") => {
    if (!editor) return;
    if (editor.isActive("textTransform", { transform })) {
      editor.chain().focus().unsetTextTransform().run();
    } else {
      editor.chain().focus().setTextTransform(transform).run();
    }
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = (editor.getAttributes("link").href as string | undefined) ?? "";
    const url = window.prompt("URL link:", previousUrl);
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const addImage = () => {
    if (!editor) return;
    const url = window.prompt("URL gambar:");
    if (!url || !url.trim()) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  const headingLevel = (() => {
    if (!editor) return "0";
    for (const level of [1, 2, 3]) {
      if (editor.isActive("heading", { level })) return String(level);
    }
    return "0";
  })();

  return (
    <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
      <div className="border-border flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          label="Urungkan"
        >
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          label="Ulangi"
        >
          <Redo2 className="size-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 h-5 w-px" />

        <select
          value={headingLevel}
          onChange={(event) => {
            if (!editor) return;
            const level = Number(event.target.value);
            if (level === 0) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 })
                .run();
            }
          }}
          className="border-border bg-background focus-visible:ring-ring h-8 rounded-md border px-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Format teks"
        >
          {HEADING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive("bold")}
          label="Tebal"
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive("italic")}
          label="Miring"
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          active={editor?.isActive("underline")}
          label="Garis bawah"
        >
          <UnderlineIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          active={editor?.isActive("strike")}
          label="Coret"
        >
          <Strikethrough className="size-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 h-5 w-px" />

        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList")}
          label="Daftar titik"
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive("orderedList")}
          label="Daftar nomor"
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          active={editor?.isActive("blockquote")}
          label="Kutipan"
        >
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCode().run()}
          active={editor?.isActive("code")}
          label="Kode"
        >
          <Code className="size-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 h-5 w-px" />

        <ToolbarButton onClick={() => toggleCase("uppercase")} label="Huruf besar">
          <CaseUpper className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => toggleCase("lowercase")} label="Huruf kecil">
          <CaseLower className="size-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 h-5 w-px" />

        <ToolbarButton onClick={setLink} active={editor?.isActive("link")} label="Tautan">
          <LinkIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} label="Gambar">
          <ImageIcon className="size-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 h-5 w-px" />

        <ToolbarButton
          onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
          label="Bersihkan format"
        >
          <Eraser className="size-4" />
        </ToolbarButton>

        <div className="ms-auto flex items-center gap-0.5">
          <ToolbarButton onClick={toggleMode} active={mode === "html"} label="Mode kode HTML">
            <Code2 className="size-4" />
          </ToolbarButton>
        </div>
      </div>

      {mode === "html" ? (
        <textarea
          value={htmlSource}
          onChange={(event) => {
            setHtmlSource(event.target.value);
            onChange(event.target.value);
          }}
          spellCheck={false}
          className="bg-background min-h-[280px] w-full resize-y px-4 py-3 font-mono text-sm leading-6 focus:outline-none"
          aria-label="Kode HTML konten"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
