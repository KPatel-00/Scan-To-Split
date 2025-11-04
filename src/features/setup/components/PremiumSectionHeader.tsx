/**
 * PremiumSectionHeader - Premium section header with badge
 * Matches landing page design language with subtle styling
 */

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { typography } from '@/lib/typography';
import { fadeInUp } from '@/lib/motion';
import { LucideIcon } from 'lucide-react';

interface PremiumSectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  count?: number;
  variant?: 'default' | 'success' | 'info' | 'warning';
  className?: string;
}

const variantStyles = {
  default: {
    text: 'text-foreground',
    badge: 'bg-primary/10 text-primary border-primary/20',
  },
  success: {
    text: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  },
  info: {
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  warning: {
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  },
};

export function PremiumSectionHeader({
  icon: Icon,
  title,
  count,
  variant = 'default',
  className = '',
}: PremiumSectionHeaderProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      variants={fadeInUp}
      className={`flex items-center gap-3 ${className}`}
    >
      {Icon && (
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 ${styles.text}`}>
          <Icon className="h-4 w-4" />
        </div>
      )}
      
      <h3 className={`${typography.h3} ${styles.text}`}>
        {title}
      </h3>

      {count !== undefined && (
        <Badge variant="outline" className={`${styles.badge} min-w-[2rem] justify-center`}>
          {count}
        </Badge>
      )}
    </motion.div>
  );
}
