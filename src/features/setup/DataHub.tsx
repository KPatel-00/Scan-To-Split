/**
 * DataHub - Items & Participants Management Section
 * PREMIUM UPGRADE: Enhanced with glass morphism, smooth animations, better spacing
 * 
 * Design Language:
 * - Matches landing page/scan portal premium feel
 * - Glass morphism cards with subtle backdrop blur
 * - Smooth tactile feedback (safeTactile patterns)
 * - Generous breathing room between sections
 * - Progressive disclosure for complex data
 * 
 * Features:
 * - Responsive: Tabs on mobile, side-by-side on desktop
 * - Items list with verification
 * - Participants management with groups
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Users, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton'; // ✨ NEW: Import Skeleton
import { ItemsManagementSection } from './ItemsManagementSection';
import { ParticipantsSection } from './ParticipantsSection';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { typography } from '../../lib/typography';
import { feedback } from '../../lib/feedback';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import type { Item, Receipt } from '../../store/useStore';

interface DataHubProps {
  managementMode: 'merged' | 'separate';
  items: Item[];
  receipts: Receipt[];
  participants: any[];
  itemSearchQuery: string;
  onBackToUpload?: () => void;
  justScanned?: boolean; // ✨ NEW: Prop to trigger initial loading state
}

export function DataHub({
  managementMode,
  items,
  receipts,
  participants,
  itemSearchQuery,
  onBackToUpload,
  justScanned = false,
}: DataHubProps) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [activeTab, setActiveTab] = useState('items');
  const [isLoading, setIsLoading] = useState(justScanned); // ✨ NEW: Local loading state

  // ✨ NEW: Effect to turn off loading after delay
  useEffect(() => {
    if (justScanned) {
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [justScanned]);

  const itemsCount = managementMode === 'merged'
    ? items.length
    : receipts.reduce((sum, r) => sum + r.items.length, 0);

  return (
    <motion.div
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back Button - Premium Ghost Style */}
      {onBackToUpload && (
        <motion.div
          className="mb-8"
          variants={fadeInUp}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              feedback.click();
              onBackToUpload();
            }}
            className="gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('setup.dataHub.backToUpload', 'Back to Upload')}
          </Button>
        </motion.div>
      )}

      {/* Section Header - Premium Typography */}
      <motion.div
        className="mb-12 space-y-3 text-center"
        variants={fadeInUp}
      >
        <h2 className={typography.display.md}>
          {t('setup.dataHub.title', 'Your Bill Details')}
        </h2>
        <p className={typography.body.lgMuted}>
          {t('setup.dataHub.subtitle', 'Review items and add participants')}
        </p>
      </motion.div>

      {/* Mobile: Tabs Layout - Premium Card Style */}
      {isMobile ? (
        <motion.div variants={fadeInUp}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 bg-muted/50 p-1">
              <TabsTrigger
                value="items"
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <ShoppingCart className="h-4 w-4" />
                {t('setup.dataHub.itemsTab', 'Items')} ({itemsCount})
              </TabsTrigger>
              <TabsTrigger
                value="people"
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Users className="h-4 w-4" />
                {t('setup.dataHub.participantsTab', 'People')} ({participants.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="mt-0 space-y-6">
              {isLoading ? (
                // ✨ NEW: Skeleton Loading for Items
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <ItemsManagementSection
                  managementMode={managementMode}
                  items={items}
                  receipts={receipts}
                  itemSearchQuery={itemSearchQuery}
                />
              )}
            </TabsContent>

            <TabsContent value="people" className="mt-0">
              <ParticipantsSection />
            </TabsContent>
          </Tabs>
        </motion.div>
      ) : (
        /* Desktop: Side-by-Side Premium Layout */
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {/* Items Section (2/3 width) */}
          <motion.div
            className="md:col-span-2"
            variants={fadeInUp}
          >
            {isLoading ? (
              // ✨ NEW: Skeleton Loading for Items (Desktop)
              <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-9 w-32" />
                </div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <ItemsManagementSection
                managementMode={managementMode}
                items={items}
                receipts={receipts}
                itemSearchQuery={itemSearchQuery}
              />
            )}
          </motion.div>

          {/* Participants Section (1/3 width, sticky) */}
          <motion.div
            className="md:col-span-1"
            variants={fadeInUp}
          >
            <div className="sticky top-28">
              <ParticipantsSection />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
