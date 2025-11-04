import * as React from "react"
import { motion } from "framer-motion"

import { cn } from '../../lib/utils'
import { cardTactile, contentEntry, contentEntryTransition } from '../../lib/motion'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean; // Enable hover lift effect
  animate?: boolean; // Enable entrance animation
  interactive?: boolean; // Enable full tactile feedback (hover + tap)
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, animate = false, interactive = false, ...props }, ref) => {
    // Interactive cards get full tactile feedback
    if (interactive) {
      const { onDrag, onDragEnd, onDragStart, ...motionProps } = props as any;
      
      return (
        <motion.div
          ref={ref}
          className={cn(
            "rounded-xl border bg-card text-card-foreground shadow cursor-pointer",
            className
          )}
          variants={animate ? contentEntry : undefined}
          initial={animate ? 'initial' : undefined}
          animate={animate ? 'animate' : undefined}
          exit={animate ? 'exit' : undefined}
          transition={animate ? contentEntryTransition : undefined}
          whileHover={cardTactile.hover}
          whileTap={cardTactile.tap}
          {...motionProps}
        />
      )
    }
    
    // Animated cards with entrance effect
    if (animate) {
      const { onDrag, onDragEnd, onDragStart, ...motionProps } = props as any;
      
      return (
        <motion.div
          ref={ref}
          className={cn(
            "rounded-xl border bg-card text-card-foreground shadow",
            className
          )}
          variants={contentEntry}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={contentEntryTransition}
          whileHover={hover ? cardTactile.hover : undefined}
          {...motionProps}
        />
      )
    }
    
    // Hover-only cards
    if (hover) {
      const { onDrag, onDragEnd, onDragStart, ...motionProps } = props as any;
      
      return (
        <motion.div
          ref={ref}
          className={cn(
            "rounded-xl border bg-card text-card-foreground shadow",
            className
          )}
          whileHover={cardTactile.hover}
          {...motionProps}
        />
      )
    }
    
    // Static card (no motion)
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border bg-card text-card-foreground shadow",
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
