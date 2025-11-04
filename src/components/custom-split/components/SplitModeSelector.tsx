import { useTranslation } from 'react-i18next';
import { Label } from '../../ui/label';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';
import type { SplitMode } from '../utils/splitCalculations';

interface SplitModeSelectorProps {
  mode: SplitMode;
  onModeChange: (mode: SplitMode) => void;
}

export function SplitModeSelector({ mode, onModeChange }: SplitModeSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label>{t('assignment.customSplit.modeLabel')}</Label>
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={onModeChange}
        className="justify-start"
      >
        <ToggleGroupItem value="amount" aria-label={t('assignment.customSplit.byAmount')}>
          {t('assignment.customSplit.byAmount')}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="percentage"
          aria-label={t('assignment.customSplit.byPercentage')}
        >
          {t('assignment.customSplit.byPercentage')}
        </ToggleGroupItem>
        <ToggleGroupItem value="shares" aria-label={t('assignment.customSplit.byShares')}>
          {t('assignment.customSplit.byShares')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
