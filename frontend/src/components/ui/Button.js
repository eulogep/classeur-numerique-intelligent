import React from 'react';
import { cn, cva } from '../../lib/utils';
import Icon from './Icon';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        destructive: "bg-error-500 text-white hover:bg-error-600 focus-visible:ring-error-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        outline: "border border-primary-200 bg-transparent hover:bg-primary-50 focus-visible:ring-primary-500",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-500 shadow-lg hover:shadow-xl",
        ghost: "hover:bg-primary-50 hover:text-primary-900 focus-visible:ring-primary-500",
        link: "text-primary-500 underline-offset-4 hover:underline focus-visible:ring-primary-500",
        gradient: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 focus-visible:ring-primary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 focus-visible:ring-white/50 shadow-lg hover:shadow-xl",
        neon: "bg-transparent border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white focus-visible:ring-primary-400 shadow-[0_0_20px_rgba(102,126,234,0.3)] hover:shadow-[0_0_30px_rgba(102,126,234,0.5)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
      animated: {
        true: "animate-pulse hover:animate-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animated: false,
    },
  }
);

const Button = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  animated = false,
  icon,
  iconPosition = 'left',
  children,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, animated, className }))}
      ref={ref}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <Icon name={icon} size={16} className="mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <Icon name={icon} size={16} className="ml-2" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants }; 