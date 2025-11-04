import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Store, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ParticipantAvatar } from '../../components/ParticipantAvatar';
import { EmptyState } from '../../components/EmptyState';
import { feedback } from '../../lib/feedback';
import { layoutTransition } from '../../lib/motion';
import type { Currency, Item, Receipt } from '../../store/useStore';
import type { ParticipantBalance } from '../../lib/settlement';
import { smoothSlow, smoothNormal } from '@/lib/motion/physics';

interface ParticipantSummarySectionProps {
  participantBalances: ParticipantBalance[];
  items: Item[];
  receipts: Receipt[];
  currency: Currency;
  managementMode: 'merged' | 'separate';
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothSlow,
  },
};

export function ParticipantSummarySection({
  participantBalances,
  items,
  receipts,
  currency,
  managementMode,
}: ParticipantSummarySectionProps) {
  const { t } = useTranslation();

  // Expandable card state with localStorage persistence
  const [expandedCards, setExpandedCards] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('part4-expanded-cards');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  // Persist expanded state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('part4-expanded-cards', JSON.stringify(Array.from(expandedCards)));
    }
  }, [expandedCards]);

  // Toggle card expansion
  const toggleCard = (participantId: string) => {
    feedback.click();
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(participantId)) {
        next.delete(participantId);
      } else {
        next.add(participantId);
      }
      return next;
    });
  };

  return (
    <motion.div variants={itemVariants} className="space-y-4">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t('summary.participantCards.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('summary.participantCards.subtitle')}</p>
      </div>

      {/* Participant Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {participantBalances.map((balance) => {
            const isExpanded = expandedCards.has(balance.id);
            
            // Calculate items for this participant
            const participantItems = items.filter((item: any) => {
              if (item.assignments && item.assignments[balance.id]) {
                return true;
              }
              return item.assignedTo?.includes(balance.id);
            });

            // Count items
            const itemCount = participantItems.length;

            // Group items by receipt (for separate mode)
            const itemsByReceipt = managementMode === 'separate' 
              ? receipts.map(receipt => ({
                  receipt,
                  items: participantItems.filter((item: any) => 
                    receipt.items.some((rItem: any) => rItem.id === item.id)
                  ),
                })).filter(group => group.items.length > 0)
              : [];

            // Determine badge variant and text
            let badgeVariant: 'default' | 'destructive' | 'secondary' = 'secondary';
            let badgeText = t('summary.finalSummary.even');
            
            if (balance.balance < -0.01) {
              badgeVariant = 'destructive';
              badgeText = `${t('summary.finalSummary.owes')} ${currency.symbol}${Math.abs(balance.balance).toFixed(2)}`;
            } else if (balance.balance > 0.01) {
              badgeVariant = 'default';
              badgeText = `${t('summary.finalSummary.owed')} ${currency.symbol}${balance.balance.toFixed(2)}`;
            }

            return (
              <motion.div
                key={balance.id}
                layout
                transition={layoutTransition}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Card Header - Clickable */}
                <button
                  onClick={() => toggleCard(balance.id)}
                  className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Avatar + Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <ParticipantAvatar
                        name={balance.name}
                        color={balance.color}
                        size="lg"
                      />
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold">{balance.name}</h3>
                          <Badge variant={badgeVariant} className="text-xs">
                            {badgeText}
                          </Badge>
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          {currency.symbol}{balance.totalCost.toFixed(2)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t('summary.participantCards.itemCount', { count: itemCount })}
                        </p>
                      </div>
                    </div>

                    {/* Right: Expand Icon */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={smoothNormal}
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  </div>
                </button>

                {/* Expandable Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={smoothSlow}
                      className="origin-top overflow-hidden"
                    >
                      <div className="border-t border-border px-6 py-4 bg-muted/30">
                        {participantItems.length === 0 ? (
                          /* Empty State: No items assigned to this participant */
                          <EmptyState
                            icon={ShoppingBag}
                            title={t('summary.participantCards.emptyState.title', { name: balance.name })}
                            description={t('summary.participantCards.emptyState.description', { 
                              name: balance.name,
                              defaultValue: `Looks like ${balance.name} wasn't assigned any items on this bill.`
                            })}
                            className="border-0 shadow-none bg-transparent"
                          />
                        ) : managementMode === 'merged' ? (
                          /* Merged Mode: Single itemized table with origin badges */
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm mb-3">
                              {t('summary.participantCards.yourItems')}
                            </h4>
                            <div className="space-y-2">
                              {participantItems.map((item: any) => {
                                const itemTotal = item.price * item.quantity;
                                let participantShare = 0;

                                if (item.assignments && item.assignments[balance.id]) {
                                  participantShare = item.assignments[balance.id];
                                } else if (item.assignedTo?.includes(balance.id)) {
                                  const assignedCount = item.assignedTo.length;
                                  participantShare = itemTotal / assignedCount;
                                }

                                const isNegative = item.price < 0;

                                return (
                                  <div
                                    key={item.id}
                                    className={`flex items-center justify-between p-4 rounded-lg border border-border bg-background ${
                                      isNegative ? 'text-red-700 dark:text-red-400' : ''
                                    }`}
                                  >
                                    <div className="flex items-center gap-4 flex-1">
                                      {/* Origin Badge (if multiple receipts) */}
                                      {item.originReceiptId && receipts.length > 1 && (
                                        <Badge variant="outline" className="text-xs shrink-0">
                                          {receipts.find(r => r.id === item.originReceiptId)?.storeName || 'Bill'}
                                        </Badge>
                                      )}
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{item.name}</div>
                                        {item.quantity > 1 && (
                                          <div className="text-xs text-muted-foreground">
                                            {item.quantity} × {currency.symbol}{item.price.toFixed(2)}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-sm font-semibold">
                                      {currency.symbol}{participantShare.toFixed(2)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          /* Separate Mode: Grouped by receipt */
                          <div className="space-y-4">
                            {itemsByReceipt.map((group) => (
                              <div key={group.receipt.id} className="space-y-2">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                  <Store className="h-3.5 w-3.5" />
                                  {t('summary.participantCards.itemsFrom', { 
                                    source: group.receipt.storeName || 'Unknown' 
                                  })}
                                </h4>
                                <div className="space-y-2">
                                  {group.items.map((item: any) => {
                                    const itemTotal = item.price * item.quantity;
                                    let participantShare = 0;

                                    if (item.assignments && item.assignments[balance.id]) {
                                      participantShare = item.assignments[balance.id];
                                    } else if (item.assignedTo?.includes(balance.id)) {
                                      const assignedCount = item.assignedTo.length;
                                      participantShare = itemTotal / assignedCount;
                                    }

                                    const isNegative = item.price < 0;

                                    return (
                                      <div
                                        key={item.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border border-border bg-background ${
                                          isNegative ? 'text-red-700 dark:text-red-400' : ''
                                        }`}
                                      >
                                        <div className="flex-1">
                                          <div className="font-medium text-sm">{item.name}</div>
                                          {item.quantity > 1 && (
                                            <div className="text-xs text-muted-foreground">
                                              {item.quantity} × {currency.symbol}{item.price.toFixed(2)}
                                            </div>
                                          )}
                                        </div>
                                        <div className="text-sm font-semibold">
                                          {currency.symbol}{participantShare.toFixed(2)}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
