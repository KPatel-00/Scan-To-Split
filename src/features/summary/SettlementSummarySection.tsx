import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, PartyPopper, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/card';
import { ParticipantAvatar } from '../../components/ParticipantAvatar';
import { layoutTransition } from '../../lib/motion';
import { smoothSlow } from '@/lib/motion/physics';
import type { Currency, Participant } from '../../store/useStore';
import type { Transaction, ParticipantBalance } from '../../lib/settlement';

interface SettlementSummarySectionProps {
  settlements: Transaction[];
  participantBalances: ParticipantBalance[];
  grandTotal: number;
  currency: Currency;
  participants: Participant[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothSlow,
  },
};

export function SettlementSummarySection({
  settlements,
  participantBalances,
  grandTotal,
  currency,
  participants,
}: SettlementSummarySectionProps) {
  const { t } = useTranslation();
  
  // Check if everyone is even
  const everyoneEven = settlements.length === 0;

  // Calculate per-participant costs with proportional tax/tip (for cost breakdown display)
  const participantCosts = participantBalances.map(balance => ({
    participant: participants.find(p => p.id === balance.id)!,
    cost: balance.totalCost,
    proportion: grandTotal > 0 ? balance.totalCost / grandTotal : 0,
  }));

  return (
    <>
      {/* Settlement Summary Card - Final Debt Transactions */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-br from-card to-green-50/50 dark:to-green-950/20 border-green-200/50 dark:border-green-900/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t('summary.settlement.title')}</h2>
              <p className="text-sm text-muted-foreground">{t('summary.settlement.subtitle')}</p>
            </div>
          </div>

          {everyoneEven ? (
            /* Empty State: Everyone is Even */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={smoothSlow}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 dark:bg-green-500/20 mb-4">
                <PartyPopper className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('summary.settlement.everyoneEven')}</h3>
              <p className="text-sm text-muted-foreground">{t('summary.settlement.everyoneEvenDesc')}</p>
            </motion.div>
          ) : (
            /* Settlement Transactions List */
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {settlements.map((transaction, index) => (
                  <motion.div
                    key={`${transaction.from}-${transaction.to}-${index}`}
                    layout
                    transition={layoutTransition}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-green-500/30 hover:shadow-sm transition-all"
                  >
                    {/* Left: Transaction Text */}
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        <span className="font-semibold">{transaction.from}</span>
                        {' '}
                        {t('summary.settlement.pays', { from: '', to: '' }).replace(transaction.from, '').replace(transaction.to, '').trim()}
                        {' '}
                        <span className="font-semibold">{transaction.to}</span>
                      </span>
                    </div>

                    {/* Right: Amount */}
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {currency.symbol}{transaction.amount.toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Cost Breakdown Card - Per Participant Totals */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t('summary.settlement.costBreakdown')}</h2>
              <p className="text-sm text-muted-foreground">{t('summary.settlement.costBreakdownSubtitle')}</p>
            </div>
          </div>

          {/* Participant Cost List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {participantCosts.map(({ participant, cost, proportion }) => (
                <motion.div
                  key={participant.id}
                  layout
                  transition={layoutTransition}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  {/* Left: Participant Avatar + Name */}
                  <div className="flex items-center gap-4">
                    <ParticipantAvatar
                    name={participant.name}
                    color={participant.color}
                    size="md"
                  />
                  <span className="font-medium">{participant.name}</span>
                </div>

                {/* Right: Cost */}
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {currency.symbol}{cost.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(proportion * 100).toFixed(1)}% {t('summary.ofTotal')}
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </>
  );
}
