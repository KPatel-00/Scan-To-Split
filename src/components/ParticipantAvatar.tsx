import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { smoothNormal } from '@/lib/motion/physics';

interface ParticipantAvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  layoutId?: string; // For shared element transitions
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function ParticipantAvatar({
  name,
  color,
  size = 'md',
  className,
  layoutId,
}: ParticipantAvatarProps) {
  // Ensure name is a string
  const nameStr = String(name || '');
  
  const initials = nameStr
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarContent = (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarFallback
        className="font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  // If layoutId is provided, wrap with motion for shared element animation
  if (layoutId) {
    return (
      <motion.div
        layoutId={layoutId}
        transition={{ ...smoothNormal, mass: 0.8 }}
      >
        {avatarContent}
      </motion.div>
    );
  }

  return avatarContent;
}
