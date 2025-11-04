import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { useStore } from '../../../store/useStore';

interface BillPayerSelectorProps {
  receiptId: string;
  paidBy: string | undefined;
  onPayerChange: (payerId: string, receiptId: string) => void;
}

export function BillPayerSelector({
  receiptId,
  paidBy,
  onPayerChange,
}: BillPayerSelectorProps) {
  const { t } = useTranslation();
  const participants = useStore((state) => state.participants);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {t('setup.itemsList.billInfo.paidBy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={paidBy || ''}
          onValueChange={(value) => onPayerChange(value, receiptId)}
        >
          <SelectTrigger className="w-full" aria-label={t('ariaLabels.selectPayer')}>
            <SelectValue placeholder={t('setup.itemsList.billInfo.paidBy')} />
          </SelectTrigger>
          <SelectContent>
            {participants.map((p: any) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
