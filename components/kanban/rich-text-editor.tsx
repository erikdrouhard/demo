"use client";

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { Label } from "@/components/ui/label";

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { 
  ssr: false,
  loading: () => <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter description...",
  label,
  className = "",
  minHeight = 200,
}: RichTextEditorProps) {
  const [editorValue, setEditorValue] = useState(value);

  const handleChange = useCallback((val?: string) => {
    const newValue = val || '';
    setEditorValue(newValue);
    onChange(newValue);
  }, [onChange]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </Label>
      )}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <MDEditor
          value={editorValue}
          onChange={handleChange}
          preview="edit"
          height={minHeight}
          data-color-mode="light"
          visibleDragbar={false}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 14,
              lineHeight: 1.5,
              fontFamily: 'inherit',
            },
          }}
        />
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Supports <strong>Markdown</strong> formatting (bold, italic, links, lists, etc.)
      </div>
    </div>
  );
}

// Read-only markdown viewer component
interface MarkdownViewerProps {
  content: string;
  className?: string;
  maxHeight?: string;
}

const MDViewer = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default.Markdown), { 
  ssr: false,
  loading: () => <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
});

export function MarkdownViewer({ 
  content, 
  className = "",
  maxHeight = "200px"
}: MarkdownViewerProps) {
  if (!content.trim()) {
    return (
      <div className={`text-slate-400 dark:text-slate-500 text-sm italic ${className}`}>
        No description provided
      </div>
    );
  }

  return (
    <div 
      className={`prose prose-sm dark:prose-invert prose-slate max-w-none overflow-y-auto ${className}`}
      style={{ maxHeight }}
    >
      <MDViewer source={content} />
    </div>
  );
}