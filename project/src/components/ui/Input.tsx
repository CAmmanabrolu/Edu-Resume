import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const inputVariants = cva(
  'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'focus-visible:ring-blue-500',
        error: 'border-red-500 focus-visible:ring-red-500',
      },
      size: {
        default: 'h-10',
        sm: 'h-8 text-xs px-2.5',
        lg: 'h-12 text-base px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const errorId = `${inputId}-error`;
    const descriptionId = `${inputId}-description`;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            inputVariants({
              variant: error ? 'error' : variant,
              size,
              className,
            })
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? errorId
              : helperText
              ? descriptionId
              : undefined
          }
          {...props}
        />
        {helperText && !error && (
          <p id={descriptionId} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 