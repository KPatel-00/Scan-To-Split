import { Card } from './ui/card';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode | LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  // Render icon based on type
  const renderIcon = () => {
    if (!icon) return null;
    
    // If icon is a Lucide component (function), render it as JSX
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className="h-16 w-16 text-muted-foreground/40" aria-hidden="true" />;
    }
    
    // Otherwise render as ReactNode (legacy API)
    return <div className="flex justify-center">{icon}</div>;
  };

  return (
    <Card className={cn('p-8 text-center', className)}>
      <motion.div
        className="mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          y: icon ? [0, -8, 0] : 0,
        }}
        transition={{
          scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.3 },
          y: icon ? { 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          } : undefined,
        }}
      >
        {renderIcon()}
      </motion.div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg" className="mt-4">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
