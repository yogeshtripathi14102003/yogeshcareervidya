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

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = value || "";
    lastExternalValueRef.current = value || "";
    updateEmptyState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    const incoming = value || "";
    const current = editorRef.current.innerHTML;

    if (incoming === current) {
      lastExternalValueRef.current = incoming;
      updateEmptyState();
      return;
    }

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
      // Ignore
    }
  };

  const exec = (command, arg = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();
    document.execCommand(command, false, arg);
    emitChange();
  };

  const handleFocusEditor = (e) => {
    if (editorRef.current && e.target !== editorRef.current) {
      editorRef.current.focus();
    }
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
    if (!/^https?:\/\/\S+/i.test(url)) return;
    editorRef.current.focus();
    restoreSelection();
    document.execCommand("createLink", false, url);
    emitChange();
  };

  const ToolbarButton = ({ icon, onClick, title }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="p-1.5 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
    >
      {icon}
    </button>
  );

  return (
    <div 
      className="border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-600 transition-all cursor-text"
      onMouseDown={handleFocusEditor}
    >
      {/* Toolbar */}
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

      {/* Editor Editable Canvas */}
      <div className="relative w-full" style={{ minHeight: `${minHeight}px` }}>
        {isEmpty && (
          <span className="absolute top-3 left-3 text-sm text-gray-400 pointer-events-none select-none">
            {placeholder}
          </span>
        )}

        <div
          ref={editorRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          tabIndex={0}
          role="textbox"
          aria-multiline="true"
          onInput={() => { emitChange(); saveSelection(); }}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onBlur={saveSelection}
          className="p-3 text-sm outline-none text-slate-800 w-full cursor-text block"
          style={{
            minHeight: `${minHeight}px`,
            WebkitUserModify: "read-write",
          }}
        />
      </div>
    </div>
  );
}