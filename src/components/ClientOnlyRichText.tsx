'use client'

import { useEffect, useState } from 'react'

interface ClientOnlyRichTextProps {
  content: string
  style?: React.CSSProperties
}

export function ClientOnlyRichText({ content, style }: ClientOnlyRichTextProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return server-safe fallback - strip HTML tags for plain text
    const plainText = content.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ')
    return <div style={style}>{plainText}</div>
  }

  // Client-side rendering with HTML (safely parsed)
  const parseHtmlContent = (html: string) => {
    // Create a temporary element to safely parse HTML
    const temp = document.createElement('div')
    temp.innerHTML = html

    // Convert to React elements
    const parseElement = (element: Element, key: number): React.ReactNode => {
      const tagName = element.tagName.toLowerCase()
      const children = Array.from(element.childNodes).map((child, index) => {
        if (child.nodeType === Node.TEXT_NODE) {
          return child.textContent
        }
        if (child.nodeType === Node.ELEMENT_NODE) {
          return parseElement(child as Element, index)
        }
        return null
      }).filter(Boolean)

      switch (tagName) {
        case 'ul':
          return <ul key={key} style={{ margin: '2px 0 0 16px', padding: 0, listStyleType: 'disc' }}>{children}</ul>
        case 'ol':
          return <ol key={key} style={{ margin: '2px 0 0 16px', padding: 0, listStyleType: 'decimal' }}>{children}</ol>
        case 'li':
          return <li key={key} style={{ marginBottom: '2px', paddingLeft: '4px' }}>{children}</li>
        case 'strong':
        case 'b':
          return <strong key={key}>{children}</strong>
        case 'br':
          return <br key={key} />
        case 'div':
        case 'p':
          return <div key={key}>{children}</div>
        default:
          return <span key={key}>{children}</span>
      }
    }

    return Array.from(temp.children).map((element, index) => parseElement(element, index))
  }

  return (
    <div style={style}>
      {parseHtmlContent(content)}
    </div>
  )
}
