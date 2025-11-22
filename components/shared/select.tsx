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
import { cn } from '@/lib/utils'


export interface SelectProps extends React.ComponentProps<typeof ShadSelect> {
  invalid?: boolean
  options: { label: string; value: string }[]
  placeholder?: string
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  invalid,
  options,
  placeholder = '請選擇',
  className,
  ...props
}) => {
  return (
    <ShadSelect {...props}>
      <SelectTrigger className={cn('w-full', invalid && 'border-red-500 focus:ring-red-600', className)}>
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
  )
}
