'user client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Field as ShadField,
  FieldLabel,
  FieldTitle,
  FieldContent,
  FieldDescription,
  FieldError,
} from '@/components/ui/field'

export interface FieldProps extends React.ComponentProps<typeof ShadField> {
  label?: React.ReactNode
  required?: boolean
  description?: React.ReactNode
  error?: string
  errors?: Array<{ message?: string } | undefined>
  hideError?: boolean
  labelClassName?: string
  descriptionClassName?: string
  errorClassName?: string
  children?: React.ReactNode
}

export const Field: React.FC<FieldProps> = ({
  label,
  required,
  description,
  error,
  errors,
  hideError,
  labelClassName,
  descriptionClassName,
  errorClassName,
  children,
  className,
  ...props
}) => {
  const hasError = !!(!hideError && (error || (errors && errors.length)))
  const mergedError = React.useMemo(() => {
    if (hideError) return undefined
    if (errors && errors.length) return errors
    if (error) return [{ message: error }]
    return undefined
  }, [error, errors, hideError])
  return (
    <ShadField
      data-invalid={hasError || undefined}
      className={cn(className)}
      {...props}
    >
      {/* Label 區塊 */}
      { label && (
        <FieldLabel className={cn(className)}>
          <FieldTitle>
            <span>{label}</span>
          </FieldTitle>
        </FieldLabel>
      )}
      {/* 內容、敘述、錯誤提示 */}
      <FieldContent>
        {children}

        {description && !hasError && (
          <FieldDescription className={cn(descriptionClassName)}>
            {description}
          </FieldDescription>
        )}

        {!hideError && mergedError && (
          <FieldError
            className={cn(errorClassName)}
            errors={mergedError}
          />
        )}
      </FieldContent>
    </ShadField>
  )
}
