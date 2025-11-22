'use client'

import * as React from 'react'
import {
  Select as ShadSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectProps
  extends React.ComponentProps<typeof ShadSelect> {
  invalid?: boolean
  options: { label: string; value: string }[]
  placeholder?: string
  className?: string
  clearable?: boolean
}

export const Select: React.FC<SelectProps> = ({
  invalid,
  options,
  placeholder = '請選擇',
  className,
  value,
  onValueChange,
  disabled,
  clearable = true,
  ...props
}) => {
  const showClear = clearable && value && !disabled

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation() // 防止打開 Select 下拉
    onValueChange?.('') // 清空 value
  }

  return (
    <div className="relative w-full">
      <ShadSelect value={value} onValueChange={onValueChange} disabled={disabled} {...props}>
        <SelectTrigger
          className={cn(
            'w-full',
            invalid && 'border-red-500 focus:ring-red-600',
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </ShadSelect>

      {showClear && (
        <button
          type="button"
          onClick={handleClear}
          className="
            absolute right-8 top-1/2 -translate-y-1/2
            text-muted-foreground hover:text-foreground transition
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
