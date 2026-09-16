// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Bold, Italic, List, ListOrdered, Link2, Undo, Redo } from "lucide-react";

// /**
//  * A small, dependency-free rich text editor.
//  * - Controlled via `value` (HTML string) / `onChange(html)`.
//  * - Supports bold, italic, bullet/numbered lists, links, undo/redo — enough
//  *   for a Q&A body without pulling in a full WYSIWYG library.
//  */
// export default function RichTextEditor({ value, onChange, placeholder = "Write something…", minHeight = 160 }) {
//   const editorRef = useRef(null);
//   const [isEmpty, setIsEmpty] = useState(!value);

//   useEffect(() => {
//     if (editorRef.current && value !== editorRef.current.innerHTML) {
//       editorRef.current.innerHTML = value || "";
//       setIsEmpty(!value);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // only hydrate once — after that the DOM is the source of truth while typing

//   const exec = (command, arg) => {
//     editorRef.current?.focus();
//     document.execCommand(command, false, arg);
//     handleInput();
//   };

//   const handleInput = () => {
//     const html = editorRef.current?.innerHTML || "";
//     setIsEmpty(editorRef.current?.textContent.trim() === "" && !html.includes("<img"));
//     onChange?.(html);
//   };

//   const handleLink = () => {
//     const url = window.prompt("Link URL (https://…)");
//     if (url && /^https?:\/\//i.test(url)) exec("createLink", url);
//   };

//   const ToolbarButton = ({ icon, onClick, title }) => (
//     <button
//       type="button"
//       onMouseDown={(e) => e.preventDefault()} // keep focus/selection in the editor
//       onClick={onClick}
//       title={title}
//       className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
//     >
//       {icon}
//     </button>
//   );

//   return (
//     <div className="border rounded-lg overflow-hidden">
//       <div className="flex items-center gap-0.5 border-b bg-slate-50 px-2 py-1">
//         <ToolbarButton icon={<Bold size={15} />} title="Bold" onClick={() => exec("bold")} />
//         <ToolbarButton icon={<Italic size={15} />} title="Italic" onClick={() => exec("italic")} />
//         <span className="w-px h-4 bg-slate-200 mx-1" />
//         <ToolbarButton icon={<List size={15} />} title="Bullet list" onClick={() => exec("insertUnorderedList")} />
//         <ToolbarButton icon={<ListOrdered size={15} />} title="Numbered list" onClick={() => exec("insertOrderedList")} />
//         <span className="w-px h-4 bg-slate-200 mx-1" />
//         <ToolbarButton icon={<Link2 size={15} />} title="Insert link" onClick={handleLink} />
//         <span className="w-px h-4 bg-slate-200 mx-1" />
//         <ToolbarButton icon={<Undo size={15} />} title="Undo" onClick={() => exec("undo")} />
//         <ToolbarButton icon={<Redo size={15} />} title="Redo" onClick={() => exec("redo")} />
//       </div>

//       <div className="relative">
//         {isEmpty && (
//           <span className="absolute top-2.5 left-3 text-sm text-gray-400 pointer-events-none">{placeholder}</span>
//         )}
//         <div
//           ref={editorRef}
//           contentEditable
//           suppressContentEditableWarning
//           onInput={handleInput}
//           onBlur={handleInput}
//           className="p-3 text-sm outline-none prose prose-sm max-w-none"
//           style={{ minHeight }}
//         />
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Undo,
  Redo,
} from "lucide-react";

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something…",
  minHeight = 160,
}) {
  const editorRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const lastExternalValueRef = useRef(value || "");

  const [isEmpty, setIsEmpty] = useState(!value);

  // Initial HTML
  useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.innerHTML = value || "";
    lastExternalValueRef.current = value || "";

    updateEmptyState();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only sync when value is changed externally.
  useEffect(() => {
    if (!editorRef.current) return;

    const incoming = value || "";
    const current = editorRef.current.innerHTML;

    // Do NOT touch DOM when value came from editor itself.
    if (incoming === current) {
      lastExternalValueRef.current = incoming;
      updateEmptyState();
      return;
    }

    // External change: reset/edit/cancel/etc.
    if (incoming !== lastExternalValueRef.current) {
      editorRef.current.innerHTML = incoming;
      lastExternalValueRef.current = incoming;
      updateEmptyState();
    }
  }, [value]);

  const updateEmptyState = () => {
    if (!editorRef.current) return;

    const text = editorRef.current.textContent?.trim() || "";
    const html = editorRef.current.innerHTML || "";

    setIsEmpty(text === "" && !html.includes("<img"));
  };

  const emitChange = () => {
    if (!editorRef.current) return;

    const html = editorRef.current.innerHTML || "";

    lastExternalValueRef.current = html;

    updateEmptyState();

    onChange?.(html);
  };

  const saveSelection = () => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    if (
      editorRef.current &&
      editorRef.current.contains(range.commonAncestorContainer)
    ) {
      savedSelectionRef.current = range.cloneRange();
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    const range = savedSelectionRef.current;

    if (!selection || !range) return;

    try {
      selection.removeAllRanges();
      selection.addRange(range);
    } catch {
      // Ignore invalid selection
    }
  };

  const exec = (command, arg = null) => {
    if (!editorRef.current) return;

    editorRef.current.focus();

    restoreSelection();

    document.execCommand(command, false, arg);

    emitChange();
  };

  const handleInput = () => {
    emitChange();
    saveSelection();
  };

  const handleKeyUp = () => {
    saveSelection();
  };

  const handleMouseUp = () => {
    saveSelection();
  };

  const handleLink = () => {
    if (!editorRef.current) return;

    saveSelection();

    const url = window.prompt("Link URL (https://…)");

    if (!url) {
      editorRef.current.focus();
      restoreSelection();
      return;
    }

    if (!/^https?:\/\/\S+/i.test(url)) {
      return;
    }

    editorRef.current.focus();

    restoreSelection();

    document.execCommand("createLink", false, url);

    emitChange();
  };

  const ToolbarButton = ({ icon, onClick, title }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        // Prevent toolbar click from removing editor selection.
        e.preventDefault();
      }}
      onClick={onClick}
      className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
    >
      {icon}
    </button>
  );

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b bg-slate-50 px-2 py-1">
        <ToolbarButton
          icon={<Bold size={15} />}
          title="Bold"
          onClick={() => exec("bold")}
        />

        <ToolbarButton
          icon={<Italic size={15} />}
          title="Italic"
          onClick={() => exec("italic")}
        />

        <span className="w-px h-4 bg-slate-200 mx-1" />

        <ToolbarButton
          icon={<List size={15} />}
          title="Bullet list"
          onClick={() => exec("insertUnorderedList")}
        />

        <ToolbarButton
          icon={<ListOrdered size={15} />}
          title="Numbered list"
          onClick={() => exec("insertOrderedList")}
        />

        <span className="w-px h-4 bg-slate-200 mx-1" />

        <ToolbarButton
          icon={<Link2 size={15} />}
          title="Insert link"
          onClick={handleLink}
        />

        <span className="w-px h-4 bg-slate-200 mx-1" />

        <ToolbarButton
          icon={<Undo size={15} />}
          title="Undo"
          onClick={() => exec("undo")}
        />

        <ToolbarButton
          icon={<Redo size={15} />}
          title="Redo"
          onClick={() => exec("redo")}
        />
      </div>

      {/* Editor */}
      <div className="relative">
        {isEmpty && (
          <span className="absolute top-2.5 left-3 text-sm text-gray-400 pointer-events-none select-none">
            {placeholder}
          </span>
        )}

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          tabIndex={0}
          role="textbox"
          aria-multiline="true"
          onInput={handleInput}
          onKeyUp={handleKeyUp}
          onMouseUp={handleMouseUp}
          onBlur={saveSelection}
          className="p-3 text-sm outline-none prose prose-sm max-w-none cursor-text"
          style={{
            minHeight,
            WebkitUserModify: "read-write",
          }}
        />
      </div>
    </div>
  );
}

