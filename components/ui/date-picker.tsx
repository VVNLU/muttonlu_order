'use client'

import * as React from 'react'
import { format, isBefore, isSameDay } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  disablePast?: boolean
  disableToday?: boolean
  disableTodayAfterHour?: number
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled,
  placeholder = '請選擇日期',
  className,
  disablePast = true,
  disableToday = false,
  disableTodayAfterHour,
}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'yyyy-MM-dd') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
          disabled={(date) => {
            if (!disablePast && !disableToday) return false

            const now = new Date()

            const today = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            )

            const d = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
            )

            if (disablePast && isBefore(d, today)) {
              return true
            }

            if (disableToday && isSameDay(d, today)) {
              return true
            }

            if (
              typeof disableTodayAfterHour === 'number' &&
              isSameDay(d, today)
            ) {
              if (now.getHours() >= disableTodayAfterHour) {
                return true
              }
            }

            return false
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
