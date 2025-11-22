'use client'

import * as React from 'react'
import { Input as ShadInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface InputProps extends React.ComponentProps<typeof ShadInput> {
  invalid?: boolean
}

export const Input: React.FC<InputProps> = ({
  invalid,
  type,
  placeholder = '請輸入',
  disabled,
  className,
  ...props
}) => {
  return (
    <ShadInput
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        'w-full',
        invalid && 'border-red-500 focus:ring-red-600',
        className
      )}
      {...props}
    />
  )
}
