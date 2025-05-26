'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MonthYearInput } from '@/components/ui/month-year-input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WritingAssistant } from '@/components/WritingAssistant'
import { AchievementQuantifier } from '@/components/AchievementQuantifier'
import { IndustryOptimizer } from '@/components/IndustryOptimizer'
import { Plus, Trash2 } from 'lucide-react'

interface SectionItem {
  id: string
  isPresent?: boolean
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
    type: 'text' | 'textarea' | 'date' | 'richtext' | 'select'
    placeholder?: string
    options?: string[]
  }>
  isExperience?: boolean // Special flag for work experience section
  isCertifications?: boolean // Special flag for certifications section
  isLanguages?: boolean // Special flag for languages section
}

export function ResumeSection({
  title,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  fields,
  isExperience = false,
  isCertifications = false,
  isLanguages = false
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
          <div className={isCertifications ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-6"}>
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
                  {fields.map((field) => (
                    <div key={field.key} className={field.type === 'textarea' || field.type === 'richtext' ? 'md:col-span-2' : ''}>
                      <Label htmlFor={`${item.id}-${field.key}`}>{field.label}</Label>

                      {/* Special handling for end date in experience section */}
                      {isExperience && field.key === 'endDate' ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <MonthYearInput
                              id={`${item.id}-${field.key}`}
                              value={item.isPresent ? 'Present' : (item[field.key] as string || '')}
                              onChange={(value) => onUpdateItem(item.id, field.key, value)}
                              placeholder={field.placeholder}
                              className="mt-1 flex-1"
                              disabled={item.isPresent}
                            />
                            <div className="flex items-center space-x-2 mt-1">
                              <Checkbox
                                id={`${item.id}-present`}
                                checked={item.isPresent || false}
                                onCheckedChange={(checked) => {
                                  onUpdateItem(item.id, 'isPresent', checked)
                                  if (checked) {
                                    onUpdateItem(item.id, field.key, 'Present')
                                  }
                                }}
                              />
                              <Label htmlFor={`${item.id}-present`} className="text-sm">Present</Label>
                            </div>
                          </div>
                        </div>
                      ) : field.type === 'richtext' ? (
                        <>
                          <RichTextEditor
                            value={item[field.key] as string || ''}
                            onChange={(value) => onUpdateItem(item.id, field.key, value)}
                            placeholder={field.placeholder}
                            className="mt-1"
                          />

                          {/* AI Enhancements for Experience Descriptions */}
                          {isExperience && field.key === 'description' && (
                            <>
                              <WritingAssistant
                                text={item[field.key] as string || ''}
                                context={{
                                  section: 'experience',
                                  role: item.position as string,
                                  industry: 'technology'
                                }}
                                onSuggestionApply={(original, improved) =>
                                  onUpdateItem(item.id, field.key, improved)
                                }
                                className="mt-2"
                              />

                              <AchievementQuantifier
                                text={item[field.key] as string || ''}
                                context={{
                                  role: item.position as string,
                                  industry: 'technology',
                                  company: item.company as string,
                                  experienceLevel: 'mid'
                                }}
                                onApplyQuantification={(original, quantified) =>
                                  onUpdateItem(item.id, field.key, quantified)
                                }
                                className="mt-2"
                              />

                              <IndustryOptimizer
                                currentText={item[field.key] as string || ''}
                                targetIndustry="technology"
                                targetRole={item.position as string}
                                onApplyOptimization={(optimized) =>
                                  onUpdateItem(item.id, field.key, optimized)
                                }
                                className="mt-2"
                              />
                            </>
                          )}
                        </>
                      ) : field.type === 'textarea' ? (
                        <Textarea
                          id={`${item.id}-${field.key}`}
                          value={item[field.key] as string || ''}
                          onChange={(e) => onUpdateItem(item.id, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={3}
                          className="mt-1"
                        />
                      ) : field.type === 'select' ? (
                        <Select
                          value={item[field.key] as string || ''}
                          onValueChange={(value) => onUpdateItem(item.id, field.key, value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.key.toLowerCase().includes('date') ? (
                        <MonthYearInput
                          id={`${item.id}-${field.key}`}
                          value={item[field.key] as string || ''}
                          onChange={(value) => onUpdateItem(item.id, field.key, value)}
                          placeholder={field.placeholder}
                          className="mt-1"
                        />
                      ) : (
                        <Input
                          id={`${item.id}-${field.key}`}
                          type={field.type}
                          value={item[field.key] as string || ''}
                          onChange={(e) => onUpdateItem(item.id, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Special preview for languages showing comma-separated format */}
                {isLanguages && items.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm font-medium text-blue-700 mb-2">Preview:</div>
                    <div className="text-sm text-blue-600">
                      {items
                        .filter(lang => lang.language && lang.proficiency)
                        .map((lang) => `${lang.language} [${lang.proficiency}]`)
                        .join(', ')
                      }
                    </div>
                  </div>
                )}

                {/* Special preview for certifications showing date range format */}
                {isCertifications && item.date && item.expiryDate && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm font-medium text-green-700 mb-2">Date Range Preview:</div>
                    <div className="text-sm text-green-600">
                      {item.date} - {item.expiryDate}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
