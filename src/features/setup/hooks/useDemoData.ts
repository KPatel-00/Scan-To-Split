/**
 * useDemoData - Demo bill generation logic
 * Creates sample data for testing and demonstrations
 */

import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from 'react-i18next';
import { feedback } from '@/lib/feedback';
import { getDefaultCategory } from '@/lib/taxonomy';

interface UseDemoDataReturn {
  loadDemoData: (onContinueEditing?: () => void) => void;
}

export function useDemoData(): UseDemoDataReturn {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const setIsDemoData = useStore((state) => state.setIsDemoData);
  const clearSession = useStore((state) => state.clearSession);
  const addParticipant = useStore((state) => state.addParticipant);
  const addItem = useStore((state) => state.addItem);
  const setMergedBillInfo = useStore((state) => state.setMergedBillInfo);

  const loadDemoData = (onContinueEditing?: () => void) => {
    feedback.click();
    
    // Mark as demo data BEFORE clearing (so it persists)
    setIsDemoData(true);
    
    clearSession();
    
    // Add demo participants
    addParticipant('Lukas');
    addParticipant('Sophie');
    addParticipant('Finn');
    
    // Set bill metadata
    setMergedBillInfo('ALDI SÜD', '2025-10-21');
    
    // Add demo items
    const demoItems = [
      { name: 'Bio Milch 1L', quantity: 1, price: 1.19, category: getDefaultCategory() },
      { name: 'Vollkornbrot', quantity: 1, price: 1.79, category: getDefaultCategory() },
      { name: 'Salatcup "Asia"', quantity: 1, price: 2.49, category: getDefaultCategory() },
      { name: 'Küchentücher x4', quantity: 1, price: 2.29, category: getDefaultCategory() },
      { name: 'Spülmittel', quantity: 1, price: 0.95, category: getDefaultCategory() },
      { name: 'Pfand Leergut', quantity: 1, price: -0.75, category: getDefaultCategory() },
    ];
    
    demoItems.forEach((item) => addItem(item));
    
    feedback.success();
    toast({
      title: t('messages.demoLoaded', 'Demo bill loaded!'),
      description: t('messages.demoLoadedDesc', 'Explore the features with sample data.'),
    });

    // Navigate to DataHub after loading demo
    if (onContinueEditing) {
      // Small delay to let Zustand state update
      setTimeout(() => {
        onContinueEditing();
      }, 100);
    }
  };

  return {
    loadDemoData,
  };
}
