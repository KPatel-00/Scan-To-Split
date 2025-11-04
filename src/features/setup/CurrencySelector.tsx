import { useTranslation } from 'react-i18next';
import { DollarSign, Euro, PoundSterling, IndianRupee } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useStore } from '../../store/useStore';
import { feedback } from '../../lib/feedback';

interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const currencies: CurrencyOption[] = [
  { code: 'EUR', symbol: '€', name: 'Euro', icon: Euro },
  { code: 'USD', symbol: '$', name: 'US Dollar', icon: DollarSign },
  { code: 'GBP', symbol: '£', name: 'British Pound', icon: PoundSterling },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', icon: IndianRupee },
];

export function CurrencySelector() {
  const { t } = useTranslation();
  const currency = useStore((state) => state.currency);
  const setCurrency = useStore((state) => state.setCurrency);

  const handleCurrencyChange = (newCode: string) => {
    const selected = currencies.find((c) => c.code === newCode);
    if (selected) {
      setCurrency({ code: selected.code, symbol: selected.symbol });
      feedback.click();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t('setup.itemsList.currency')}:
      </span>
      <Select value={currency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-full sm:w-48" aria-label={t('ariaLabels.selectCurrency')}>
          <SelectValue>
            <div className="flex items-center gap-2">
              {currencies.find((c) => c.code === currency.code)?.icon && (
                (() => {
                  const Icon = currencies.find((c) => c.code === currency.code)!.icon;
                  return <Icon className="h-4 w-4" />;
                })()
              )}
              <span>{currency.symbol} - {currencies.find((c) => c.code === currency.code)?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {currencies.map((curr) => {
            const Icon = curr.icon;
            return (
              <SelectItem key={curr.code} value={curr.code}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{curr.symbol}</span>
                  <span className="text-muted-foreground">-</span>
                  <span>{curr.name}</span>
                  <span className="text-xs text-muted-foreground">({curr.code})</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
