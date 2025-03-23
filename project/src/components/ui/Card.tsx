import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  'rounded-lg border bg-white shadow-sm transition-all',
  {
    variants: {
      variant: {
        default: 'border-gray-200',
        credential: 'border-blue-200 hover:shadow-md',
        highlight: 'border-blue-500 shadow-md',
        interactive: 'hover:border-blue-300 hover:shadow cursor-pointer',
      },
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface CardProps extends 
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {
  as?: React.ElementType;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, as: Component = 'div', ...props }, ref) => {
    return (
      <Component
        className={cn(cardVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
>(({ className, as: Component = 'h3', ...props }, ref) => (
  <Component
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight text-gray-900', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-500', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-4', className)} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter'; 