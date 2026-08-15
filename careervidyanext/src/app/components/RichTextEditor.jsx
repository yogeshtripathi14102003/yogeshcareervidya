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
import { Bold, Italic, List, ListOrdered, Link2, Undo, Redo } from "lucide-react";

/**
 * A small, dependency-free rich text editor.
 * - Controlled via `value` (HTML string) / `onChange(html)`.
 * - Supports bold, italic, bullet/numbered lists, links, undo/redo — enough
 *   for a Q&A body without pulling in a full WYSIWYG library.
 */
export default function RichTextEditor({ value, onChange, placeholder = "Write something…", minHeight = 160 }) {
  const editorRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(!value);
  const lastValueRef = useRef(value); // track last value WE synced, to detect external resets

  // Hydrate once on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || "";
      setIsEmpty(!value);
      lastValueRef.current = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-sync whenever `value` is changed from OUTSIDE (e.g. parent resets to ""
  // after a successful submit). We don't sync on every keystroke because the
  // DOM is the source of truth while the user is actively typing — that would
  // fight the cursor position. We only force-sync when the incoming `value`
  // no longer matches what we last pushed out via onChange, which means the
  // parent changed it deliberately (submit reset, edit-cancel, etc.).
  useEffect(() => {
    if (!editorRef.current) return;
    if (value === lastValueRef.current) return; // nothing external changed

    if (value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
      setIsEmpty(!value);
    }
    lastValueRef.current = value;
  }, [value]);

  const exec = (command, arg) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleInput = () => {
    const html = editorRef.current?.innerHTML || "";
    setIsEmpty(editorRef.current?.textContent.trim() === "" && !html.includes("<img"));
    lastValueRef.current = html; // this change came from us (the user typing)
    onChange?.(html);
  };

  const handleLink = () => {
    const url = window.prompt("Link URL (https://…)");
    if (url && /^https?:\/\//i.test(url)) exec("createLink", url);
  };

  const ToolbarButton = ({ icon, onClick, title }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep focus/selection in the editor
      onClick={onClick}
      title={title}
      className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
    >
      {icon}
    </button>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center gap-0.5 border-b bg-slate-50 px-2 py-1">
        <ToolbarButton icon={<Bold size={15} />} title="Bold" onClick={() => exec("bold")} />
        <ToolbarButton icon={<Italic size={15} />} title="Italic" onClick={() => exec("italic")} />
        <span className="w-px h-4 bg-slate-200 mx-1" />
        <ToolbarButton icon={<List size={15} />} title="Bullet list" onClick={() => exec("insertUnorderedList")} />
        <ToolbarButton icon={<ListOrdered size={15} />} title="Numbered list" onClick={() => exec("insertOrderedList")} />
        <span className="w-px h-4 bg-slate-200 mx-1" />
        <ToolbarButton icon={<Link2 size={15} />} title="Insert link" onClick={handleLink} />
        <span className="w-px h-4 bg-slate-200 mx-1" />
        <ToolbarButton icon={<Undo size={15} />} title="Undo" onClick={() => exec("undo")} />
        <ToolbarButton icon={<Redo size={15} />} title="Redo" onClick={() => exec("redo")} />
      </div>

      <div className="relative">
        {isEmpty && (
          <span className="absolute top-2.5 left-3 text-sm text-gray-400 pointer-events-none">{placeholder}</span>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleInput}
          className="p-3 text-sm outline-none prose prose-sm max-w-none"
          style={{ minHeight }}
        />
      </div>
    </div>
  );
}