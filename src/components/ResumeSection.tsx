'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Plus, Trash2 } from 'lucide-react'

interface SectionItem {
  id: string
  [key: string]: string | boolean | undefined
}

interface ResumeSectionProps {
  title: string
  items: SectionItem[]
  onAddItem: () => void
  onUpdateItem: (id: string, field: string, value: string | boolean) => void
  onDeleteItem: (id: string) => void
  fields: Array<{
    key: string
    label: string
    type: 'text' | 'textarea' | 'date' | 'checkbox' | 'richtext'
    placeholder?: string
  }>
  sectionType?: string
}

export function ResumeSection({
  title,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  fields,
  sectionType
}: ResumeSectionProps) {
  return (
    <Card className="rounded-xl p-6">
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Button
            onClick={onAddItem}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Item
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No items added yet. Click "Add New Item" to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-end">
                  <Button
                    onClick={() => onDeleteItem(item.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field) => {
                    // Special handling for work experience "Present" checkbox
                    if (field.key === 'isPresent' && sectionType === 'experience') {
                      return (
                        <div key={field.key} className="flex items-center gap-2">
                          <input
                            id={`${item.id}-${field.key}`}
                            type="checkbox"
                            checked={item[field.key] === 'true' || item[field.key] === true}
                            onChange={(e) => onUpdateItem(item.id, field.key, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <Label htmlFor={`${item.id}-${field.key}`} className="text-sm">
                            {field.label}
                          </Label>
                        </div>
                      )
                    }

                    return (
                      <div key={field.key} className={
                        field.type === 'textarea' || field.type === 'richtext' ? 'md:col-span-2' : ''
                      }>
                        <Label htmlFor={`${item.id}-${field.key}`}>{field.label}</Label>
                        {field.type === 'richtext' ? (
                          <RichTextEditor
                            id={`${item.id}-${field.key}`}
                            value={item[field.key] || ''}
                            onChange={(value) => onUpdateItem(item.id, field.key, value)}
                            placeholder={field.placeholder}
                            className="mt-1"
                          />
                        ) : field.type === 'textarea' ? (
                          <Textarea
                            id={`${item.id}-${field.key}`}
                            value={item[field.key] || ''}
                            onChange={(e) => onUpdateItem(item.id, field.key, e.target.value)}
                            placeholder={field.placeholder}
                            rows={3}
                            className="mt-1"
                          />
                        ) : field.type === 'checkbox' ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              id={`${item.id}-${field.key}`}
                              type="checkbox"
                              checked={item[field.key] === 'true' || item[field.key] === true}
                              onChange={(e) => onUpdateItem(item.id, field.key, e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <Label htmlFor={`${item.id}-${field.key}`} className="text-sm">
                              {field.placeholder}
                            </Label>
                          </div>
                        ) : (
                          <Input
                            id={`${item.id}-${field.key}`}
                            type={field.type}
                            value={item[field.key] || ''}
                            onChange={(e) => onUpdateItem(item.id, field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="mt-1"
                            // Disable end date field if "Present" is checked for work experience
                            disabled={
                              field.key === 'endDate' &&
                              sectionType === 'experience' &&
                              (item.isPresent === 'true' || item.isPresent === true)
                            }
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
