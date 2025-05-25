'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[120px] p-3 border border-gray-300 rounded-md bg-gray-50">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  )
})

// Dynamically import CSS to avoid SSR issues
if (typeof window !== 'undefined') {
  import('react-quill/dist/quill.snow.css')
}

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter description...",
  id,
  className = ""
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [editorError, setEditorError] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Error boundary for the rich text editor
  const handleEditorError = () => {
    setEditorError(true)
  }

  // Quill modules configuration
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ],
  }

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet'
  ]

  // Convert HTML to plain text for PDF generation
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  // Convert formatted text to display format
  const convertToDisplayFormat = (html: string) => {
    if (!html) return ''

    // Replace HTML formatting with simple text formatting
    const text = html
      .replace(/<strong>/g, '**')
      .replace(/<\/strong>/g, '**')
      .replace(/<em>/g, '*')
      .replace(/<\/em>/g, '*')
      .replace(/<u>/g, '_')
      .replace(/<\/u>/g, '_')
      .replace(/<ol[^>]*>/g, '')
      .replace(/<\/ol>/g, '')
      .replace(/<ul[^>]*>/g, '')
      .replace(/<\/ul>/g, '')
      .replace(/<li[^>]*>/g, '• ')
      .replace(/<\/li>/g, '\n')
      .replace(/<p[^>]*>/g, '')
      .replace(/<\/p>/g, '\n')
      .replace(/<br[^>]*>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')

    return text.trim()
  }

  const handleChange = (content: string) => {
    onChange(content)
  }

  // Fallback to regular textarea if editor fails or isn't mounted
  if (!isMounted || editorError) {
    return (
      <div className={className}>
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={{ minHeight: '120px' }}
        />
      </div>
    )
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <div onError={handleEditorError}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          style={{
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            minHeight: '120px'
          }}
        />
      </div>
      <style jsx global>{`
        .ql-toolbar {
          border-top: 1px solid #d1d5db !important;
          border-left: 1px solid #d1d5db !important;
          border-right: 1px solid #d1d5db !important;
          border-bottom: none !important;
          border-radius: 6px 6px 0 0 !important;
          background: #f9fafb;
        }
        .ql-container {
          border-bottom: 1px solid #d1d5db !important;
          border-left: 1px solid #d1d5db !important;
          border-right: 1px solid #d1d5db !important;
          border-top: none !important;
          border-radius: 0 0 6px 6px !important;
          font-family: inherit;
          font-size: 14px;
        }
        .ql-editor {
          min-height: 80px;
          font-family: inherit;
          line-height: 1.5;
        }
        .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
        }
      `}</style>
    </div>
  )
}

// Helper function to convert rich text to plain text for preview
export const richTextToPlainText = (html: string): string => {
  if (!html) return ''

  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    // Server-side fallback - simple regex cleanup
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim()
  }

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // Convert to plain text while preserving formatting
  let result = ''
  const processNode = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent || ''
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element

      switch (element.tagName.toLowerCase()) {
        case 'li':
          result += '• '
          element.childNodes.forEach(processNode)
          result += '\n'
          break
        case 'p':
        case 'div':
          element.childNodes.forEach(processNode)
          result += '\n'
          break
        case 'br':
          result += '\n'
          break
        default:
          element.childNodes.forEach(processNode)
      }
    }
  }

  tempDiv.childNodes.forEach(processNode)
  return result.trim()
}
