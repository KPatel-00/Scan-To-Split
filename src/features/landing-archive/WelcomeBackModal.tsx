/**
 * Enhanced Welcome Back Modal
 * 
 * Premium returning user experience with session stats,
 * personalized greeting, and quick actions.
 * 
 * ✨ REFACTORED: Now self-manages open state via Zustand store
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import {
  Sparkles,
  Receipt,
  TrendingUp,
  Clock,
  Package,
  RotateCcw,
  Play,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { feedback } from '../../lib/feedback';
import { getSessionStats } from '../../lib/session';
import { useStore } from '../../store/useStore';

interface WelcomeBackModalProps {
  // ✨ No more 'open' prop! Modal reads its own state from store
  onContinue: () => void;
  onStartNew: () => void;
  itemCount: number;
  participantCount: number;
  receiptCount: number;
}

export function WelcomeBackModal({
  onContinue,
  onStartNew,
  itemCount,
  participantCount,
  receiptCount,
}: WelcomeBackModalProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState(getSessionStats());

  // ✨ Read open state directly from store
  const open = useStore((state) => state.isWelcomeBackModalOpen);

  useEffect(() => {
    if (open) {
      setStats(getSessionStats());
    }
  }, [open]);

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return t('welcomeBack.greetingMorning');
    if (hour < 18) return t('welcomeBack.greetingAfternoon');
    return t('welcomeBack.greetingEvening');
  };

  const getSessionDuration = (): string => {
    const now = Date.now();
    const diff = now - stats.lastVisit.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return t('welcomeBack.lastSeenDays', { count: days });
    if (hours > 0) return t('welcomeBack.lastSeenHours', { count: hours });
    if (minutes > 0) return t('welcomeBack.lastSeenMinutes', { count: minutes });
    return t('welcomeBack.lastSeenJustNow');
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/20"
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl">
                  {getGreeting()}
                </DialogTitle>
                {/* Premium "Active Session" badge */}
                <Badge variant="secondary" className="gap-1 animate-pulse">
                  <Zap className="h-3 w-3" />
                  {t('welcomeBack.activeSession')}
                </Badge>
              </div>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{getSessionDuration()}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Session Info */}
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{t('welcomeBack.currentBill')}</h3>
              </div>
              {/* Premium "In Progress" status badge */}
              <Badge variant="outline" className="gap-1 border-primary/30">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-primary"
                />
                {t('welcomeBack.inProgress')}
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{itemCount}</span>
                  {itemCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {t('welcomeBack.ready')}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('common.items', { count: itemCount })}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{participantCount}</span>
                  {participantCount > 1 && (
                    <Badge variant="secondary" className="text-xs">
                      {t('welcomeBack.ready')}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('common.people', { count: participantCount })}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{receiptCount || 0}</span>
                  {receiptCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {t('welcomeBack.scanned')}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('welcomeBack.receipts', { count: receiptCount || 0 })}
                </p>
              </motion.div>
            </div>
          </Card>

          {/* Usage Stats */}
          {stats.billsCompleted > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {t('welcomeBack.yourActivity')}
                </h3>
                {/* Achievement badge for milestone */}
                {stats.billsCompleted >= 10 && (
                  <Badge className="gap-1 bg-gradient-to-r from-primary to-primary/80">
                    <Sparkles className="h-3 w-3" />
                    {t('welcomeBack.powerUser')}
                  </Badge>
                )}
                {stats.billsCompleted >= 5 && stats.billsCompleted < 10 && (
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {t('welcomeBack.regular')}
                  </Badge>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:border-primary/30 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Receipt className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">{stats.billsCompleted}</p>
                      {stats.billsCompleted > 0 && (
                        <Badge variant="outline" className="text-xs border-primary/30">
                          +{stats.billsCompleted}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('welcomeBack.billsCompleted')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:border-primary/30 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">{stats.itemsProcessed}</p>
                      {stats.itemsProcessed >= 50 && (
                        <Badge variant="outline" className="text-xs border-primary/30">
                          {t('welcomeBack.impressive')}!
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('welcomeBack.itemsProcessed')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                feedback.click();
                onStartNew();
              }}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t('buttons.startNew')}
            </Button>
            <Button
              onClick={() => {
                feedback.success();
                onContinue();
              }}
              className="gap-2"
              size="lg"
            >
              <Play className="h-4 w-4" />
              {t('buttons.continue')}
            </Button>
          </div>

          {/* Helpful Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-lg bg-muted/50 p-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{t('welcomeBack.tip.title')}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('welcomeBack.tip.description')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
