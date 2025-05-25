'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Bold, List, ListOrdered } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const handleCommand = useCallback((command: string) => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand(command, false)
      // Get the updated content
      const content = editorRef.current.innerHTML
      onChange(content)
    }
  }, [onChange])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      onChange(content)
    }
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          handleCommand('bold')
          break
      }
    }
  }, [handleCommand])

  const stripHtml = useCallback((html: string) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }, [])

  React.useEffect(() => {
    if (editorRef.current) {
      // Only update if content is different to avoid cursor position issues
      const currentContent = editorRef.current.innerHTML
      if (currentContent !== value) {
        editorRef.current.innerHTML = value || ''
      }
    }
  }, [value])

  const isEmpty = !value || stripHtml(value).trim().length === 0

  return (
    <div className={cn("border border-gray-200 rounded-md overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleCommand('bold')}
          className="h-8 w-8 p-0"
        >
          <Bold size={14} />
        </Button>

        <div className="w-px h-4 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleCommand('insertUnorderedList')}
          className="h-8 w-8 p-0"
        >
          <List size={14} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleCommand('insertOrderedList')}
          className="h-8 w-8 p-0"
        >
          <ListOrdered size={14} />
        </Button>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="min-h-[100px] p-3 text-sm focus:outline-none prose prose-sm max-w-none"
          style={{ whiteSpace: 'pre-wrap' }}
          suppressContentEditableWarning
        />

        {isEmpty && placeholder && (
          <div className="absolute top-3 left-3 text-gray-400 text-sm pointer-events-none select-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to render rich text content in preview
export const renderRichText = (htmlContent: string) => {
  if (!htmlContent) return ''

  // Simple HTML to text conversion for PDF and basic display
  return htmlContent
    .replace(/<strong>/g, '**')
    .replace(/<\/strong>/g, '**')
    .replace(/<b>/g, '**')
    .replace(/<\/b>/g, '**')
    .replace(/<ul>/g, '\n')
    .replace(/<\/ul>/g, '\n')
    .replace(/<ol>/g, '\n')
    .replace(/<\/ol>/g, '\n')
    .replace(/<li>/g, '• ')
    .replace(/<\/li>/g, '\n')
    .replace(/<br>/g, '\n')
    .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
    .trim()
}
