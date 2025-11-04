/**
 * Session Insights Modal
 * 
 * Premium analytics dashboard for anonymous users.
 * Shows usage patterns, achievements, and productivity stats.
 * 
 * ✨ REFACTORED: Now self-manages open state via Zustand store
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import {
  TrendingUp,
  Calendar,
  Receipt,
  Package,
  Camera,
  Award,
  Zap,
  Download,
  Trash2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { feedback } from '../../lib/feedback';
import { 
  getSessionStats, 
  exportSessionData, 
  clearSessionData,
} from '../../lib/session';
import { useStore } from '../../store/useStore';

interface SessionInsightsModalProps {
  // ✨ No more props! Modal is completely self-contained
}

export function SessionInsightsModal({}: SessionInsightsModalProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState(getSessionStats());
  
  // ✨ Read state and actions from store
  const open = useStore((state) => state.isSessionInsightsModalOpen);
  const closeSessionInsightsModal = useStore((state) => state.closeSessionInsightsModal);
  const clearAll = useStore((state) => state.clearAll);

  useEffect(() => {
    if (open) {
      setStats(getSessionStats());
    }
  }, [open]);

  const handleExport = () => {
    feedback.click();
    try {
      const data = exportSessionData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scantosplit-session-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      feedback.success();
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  const handleClearData = () => {
    if (confirm(t('sessionInsights.clearDataConfirm'))) {
      feedback.click();
      clearSessionData();
      clearAll();
      setStats(getSessionStats());
      feedback.success();
      closeSessionInsightsModal(); // ✨ Use store action
    }
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (stats.billsCompleted >= 1) {
      achievements.push({ 
        icon: Receipt, 
        title: t('sessionInsights.achievements.firstBill'),
        unlocked: true,
      });
    }
    
    if (stats.billsCompleted >= 10) {
      achievements.push({ 
        icon: TrendingUp, 
        title: t('sessionInsights.achievements.tenBills'),
        unlocked: true,
      });
    }
    
    if (stats.receiptsScanned >= 1) {
      achievements.push({ 
        icon: Camera, 
        title: t('sessionInsights.achievements.firstScan'),
        unlocked: true,
      });
    }
    
    if (stats.itemsProcessed >= 100) {
      achievements.push({ 
        icon: Package, 
        title: t('sessionInsights.achievements.hundredItems'),
        unlocked: true,
      });
    }
    
    if (stats.tenureDays >= 7) {
      achievements.push({ 
        icon: Calendar, 
        title: t('sessionInsights.achievements.weekUser'),
        unlocked: true,
      });
    }
    
    return achievements;
  };

  const achievements = getAchievements();

  return (
    <Dialog open={open} onOpenChange={closeSessionInsightsModal}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/20">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {t('sessionInsights.title')}
              </DialogTitle>
              <DialogDescription>
                {t('sessionInsights.description')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Receipt className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.billsCompleted}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('sessionInsights.stats.billsCompleted')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.itemsProcessed}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('sessionInsights.stats.itemsProcessed')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.receiptsScanned}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('sessionInsights.stats.receiptsScanned')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.avgItemsPerBill}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('sessionInsights.stats.avgItems')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Session Info */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <Calendar className="h-5 w-5 text-primary" />
              {t('sessionInsights.sessionInfo.title')}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('sessionInsights.sessionInfo.firstVisit')}
                </p>
                <p className="font-medium">
                  {stats.firstVisit.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('sessionInsights.sessionInfo.totalSessions')}
                </p>
                <p className="font-medium">{stats.sessionCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('sessionInsights.sessionInfo.memberSince')}
                </p>
                <p className="font-medium">
                  {stats.tenureDays === 0 
                    ? t('sessionInsights.sessionInfo.today')
                    : t('sessionInsights.sessionInfo.daysAgo', { count: stats.tenureDays })
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('sessionInsights.sessionInfo.sessionId')}
                </p>
                <p className="truncate font-mono text-xs">{stats.sessionId}</p>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          {achievements.length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <Award className="h-5 w-5 text-primary" />
                {t('sessionInsights.achievements.title')}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4 rounded-lg border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                        <achievement.icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">{achievement.title}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          )}

          {/* Data Management */}
          <Card className="border-muted bg-muted/20 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <Download className="h-5 w-5 text-muted-foreground" />
              {t('sessionInsights.dataManagement.title')}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {t('sessionInsights.dataManagement.description')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {t('sessionInsights.dataManagement.export')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearData}
                className="gap-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                {t('sessionInsights.dataManagement.clearAll')}
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={closeSessionInsightsModal} variant="outline">
            {t('buttons.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
