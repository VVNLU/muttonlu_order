'use client'

import * as React from 'react'
import {
  DatePicker as ShadDatePicker,
  type DatePickerProps as ShadDatePickerProps,
} from '@/components/ui/date-picker'
import { cn } from '@/lib/utils'

export interface DatePickerProps extends ShadDatePickerProps {
  invalid?: boolean
}

export const DatePicker: React.FC<DatePickerProps> = ({
  invalid,
  className,
  ...props
}) => {
  return (
    <ShadDatePicker
      {...props}
      className={cn(
        'w-full',
        invalid && 'border-red-500 focus:ring-red-600',
        className,
      )}
    />
  )
}
