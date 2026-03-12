import React from 'react';
import { cn, cva } from '../../lib/utils';

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200 hover:shadow-lg hover:border-primary-200",
        glass: "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/30",
        gradient: "bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200 hover:from-primary-100 hover:to-secondary-100",
        neon: "bg-white border-primary-400 shadow-[0_0_20px_rgba(102,126,234,0.1)] hover:shadow-[0_0_30px_rgba(102,126,234,0.2)] hover:border-primary-500",
        dark: "bg-gray-900 border-gray-700 text-white hover:border-gray-600",
      },
      hover: {
        true: "transform hover:-translate-y-1 hover:scale-105",
        false: "",
      },
      animated: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: false,
      animated: false,
    },
  }
);

const Card = React.forwardRef(({ className, variant, hover, animated, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, hover, animated, className }))}
    {...props}
  >
    {children}
  </div>
));

const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  >
    {children}
  </div>
));

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h3>
));

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
));

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </div>
));

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }; 