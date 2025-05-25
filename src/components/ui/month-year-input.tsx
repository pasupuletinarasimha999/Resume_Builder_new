'use client'

import { useState, useEffect } from 'react'
import { Input } from './input'
import { Label } from './label'

interface MonthYearInputProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function MonthYearInput({
  id,
  value = '',
  onChange,
  placeholder = 'MM-YYYY (e.g., 05-2024)',
  className
}: MonthYearInputProps) {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputVal = e.target.value.replace(/[^\d-]/g, '') // Remove non-digits and non-hyphens

    // Handle different input scenarios
    if (inputVal.length === 2 && !inputVal.includes('-')) {
      inputVal = `${inputVal}-`
    } else if (inputVal.length > 7) {
      inputVal = inputVal.substring(0, 7)
    }

    // Validate and format
    if (inputVal.match(/^\d{1,2}-?\d{0,4}$/)) {
      setInputValue(inputVal)

      // If we have a complete MM-YYYY format, call onChange
      if (inputVal.match(/^\d{2}-\d{4}$/)) {
        const [month, year] = inputVal.split('-')
        const monthNum = Number.parseInt(month)
        const yearNum = Number.parseInt(year)

        if (monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
          onChange?.(inputVal)
        }
      } else if (inputVal.toLowerCase() === 'present' || inputVal.toLowerCase() === 'current') {
        onChange?.('Present')
      } else {
        onChange?.(inputVal)
      }
    }
  }

  const handleBlur = () => {
    // Handle special cases
    if (inputValue.toLowerCase() === 'present' || inputValue.toLowerCase() === 'current') {
      setInputValue('Present')
      onChange?.('Present')
      return
    }

    // Try to format incomplete input
    if (inputValue.match(/^\d{1,2}$/)) {
      // Just month, add current year
      const currentYear = new Date().getFullYear()
      const month = inputValue.padStart(2, '0')
      const formatted = `${month}-${currentYear}`
      setInputValue(formatted)
      onChange?.(formatted)
    } else if (inputValue.match(/^\d{1,2}-\d{1,3}$/)) {
      // Month and partial year
      const [month, year] = inputValue.split('-')
      const fullYear = year.length === 2 ? `20${year}` : year.padStart(4, '20')
      const formatted = `${month.padStart(2, '0')}-${fullYear}`
      setInputValue(formatted)
      onChange?.(formatted)
    }
  }

  return (
    <Input
      id={id}
      type="text"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
    />
  )
}
