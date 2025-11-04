import { motion } from 'framer-motion';
import { ItemsList } from './ItemsList';
import { SeparateBillsTabs } from '../../components/separate-bills';
import { BillModifiers } from './BillModifiers';
import { VerificationCard } from './VerificationCard';
import { GrandTotalCard } from './GrandTotalCard';
import { BillAccordion } from './BillAccordion';
import type { Item, Receipt } from '../../store/useStore';
import { smoothSlow } from '@/lib/motion/physics';

interface ItemsManagementSectionProps {
  managementMode: 'merged' | 'separate';
  items: Item[];
  receipts: Receipt[];
  itemSearchQuery: string;
}

export function ItemsManagementSection({
  managementMode,
  items,
  receipts,
  itemSearchQuery,
}: ItemsManagementSectionProps) {
  return (
    <>
      {/* Multi-Bill Accordion (Separate Mode) */}
      {managementMode === 'separate' && receipts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...smoothSlow,
            delay: 0.15,
          }}
        >
          <BillAccordion />
        </motion.div>
      )}

      {/* Items List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ...smoothSlow,
          delay: 0.2,
        }}
        className="space-y-4"
      >
        {/* Conditional rendering based on management mode */}
        {managementMode === 'merged' ? (
          <ItemsList />
        ) : (
          <SeparateBillsTabs searchQuery={itemSearchQuery} />
        )}
      </motion.div>

      {/* Bill Modifiers (Tax/Tip) - Only for merged mode */}
      {managementMode === 'merged' && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...smoothSlow,
            delay: 0.25,
          }}
        >
          <BillModifiers />
        </motion.div>
      )}

      {/* Verification Card - Conditional based on management mode */}
      {managementMode === 'merged' && items.length > 0 && (
        <VerificationCard />
      )}

      {/* Grand Total Verification Card (Separate Mode Only) */}
      {managementMode === 'separate' && receipts.length > 0 && (
        <GrandTotalCard />
      )}
    </>
  );
}
