'use client'

import * as React from 'react'
import { Button as ShadButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// 先從 ShadButton 繼承所有原本的 props
// 再用 Omit 把它原本的 variant / size 拿掉，改成你自己的定義
export interface ButtonProps
  extends Omit<React.ComponentProps<typeof ShadButton>, 'variant' | 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'px-3 py-1 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base'

  return (
    <ShadButton
      {...props}
      className={cn(
        sizeClass,
        variant === 'destructive' && 'bg-red-600 text-white hover:bg-red-700',
        variant === 'outline' && 'border border-gray-300 text-gray-700 hover:bg-gray-100',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        'rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
    >
      {children}
    </ShadButton>
  )
}
