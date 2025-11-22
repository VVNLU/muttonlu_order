'use client'

import * as React from 'react'
import { Input as ShadInput } from '@/components/ui/input'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.ComponentProps<typeof ShadInput> {
  invalid?: boolean
  clearable?: boolean
}

export const Input: React.FC<InputProps> = ({
  invalid,
  clearable = true,
  className,
  value,
  onChange,
  disabled,
  placeholder = '請輸入',
  ...props
}) => {
  const showClear = clearable && value && !disabled

  const handleClear = () => {
    const event = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>
    onChange?.(event)
  }

  return (
    <div className="relative w-full">
      <ShadInput
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          'w-full pr-6',
          invalid && 'border-red-500 focus:ring-red-600',
          className
        )}
        {...props}
      />

      {showClear && (
        <button
          type="button"
          onClick={handleClear}
          className="
            absolute right-2 top-1/2 -translate-y-1/2 
            text-muted-foreground hover:text-foreground transition
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
