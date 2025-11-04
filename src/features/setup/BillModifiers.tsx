import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { ParticipantAvatar } from '../../components/ParticipantAvatar';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { Calculator, HelpCircle, UserCircle } from 'lucide-react';

interface BillModifiersProps {
  receiptId?: string;
}

export function BillModifiers({ receiptId }: BillModifiersProps = {}) {
  const { t } = useTranslation();
  const receipts = useStore((state) => state.receipts);
  const participants = useStore((state) => state.participants);
  const mergedPaidBy = useStore((state) => state.mergedPaidBy);
  const setPayer = useStore((state) => state.setPayer);
  const updateReceipt = useStore((state) => state.updateReceipt);
  const currency = useStore((state) => state.currency);
  const items = useStore((state) => state.items);

  // Get the specified receipt or the first one
  const receipt = receiptId 
    ? receipts.find((r) => r.id === receiptId)
    : receipts[0];
  
  // Filter items for this receipt
  const receiptItems = receiptId
    ? items.filter((item) => item.originReceiptId === receiptId)
    : items;

  const handleTaxChange = (value: string) => {
    const tax = parseFloat(value) || 0;
    if (receipt) {
      updateReceipt(receipt.id, { tax });
    }
  };

  const handleTipChange = (value: string) => {
    const tip = parseFloat(value) || 0;
    if (receipt) {
      updateReceipt(receipt.id, { tip });
    }
  };

  const handlePayerChange = (participantId: string) => {
    setPayer(participantId, receiptId);
  };

  const subtotal = receiptItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = receipt?.tax || 0;
  const tip = receipt?.tip || 0;
  const total = subtotal + tax + tip;
  
  if (!receipt) {
    return null;
  }

  return (
    <Card className="bill-modifiers-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {t('modifiers.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payer Selector - Premium Feature */}
        {participants.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="payer" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-primary" />
              {t('modifiers.paidBy', 'Paid By')}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{t('modifiers.paidByTooltip', 'Select who paid for this bill. This helps calculate who owes whom.')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select 
              value={receiptId ? (receipt?.paidBy || '') : (mergedPaidBy || '')}
              onValueChange={handlePayerChange}
            >
              <SelectTrigger id="payer" className="w-full">
                <SelectValue placeholder={t('modifiers.selectPayer', 'Select who paid...')}>
                  {(() => {
                    const payerId = receiptId ? receipt?.paidBy : mergedPaidBy;
                    const payer = participants.find(p => p.id === payerId);
                    return payer ? (
                      <div className="flex items-center gap-2">
                        <ParticipantAvatar name={payer.name} color={payer.color} size="sm" />
                        <span>{payer.name}</span>
                      </div>
                    ) : t('modifiers.selectPayer', 'Select who paid...');
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {participants.map((participant) => (
                  <SelectItem key={participant.id} value={participant.id}>
                    <div className="flex items-center gap-2">
                      <ParticipantAvatar 
                        name={participant.name} 
                        color={participant.color} 
                        size="sm" 
                      />
                      <span>{participant.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t('modifiers.paidByHint', 'The payer will be credited for the full amount in the final settlement.')}
            </p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {/* Tax Input */}
          <div className="space-y-2">
            <Label htmlFor="tax" className="flex items-center gap-2">
              {t('modifiers.tax')}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{t('modifiers.taxTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {currency.symbol}
              </span>
              <Input
                id="tax"
                type="number"
                step="0.01"
                min="0"
                value={tax || ''}
                onChange={(e) => handleTaxChange(e.target.value)}
                placeholder="0.00"
                className="pl-8"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t('modifiers.taxHint')}
            </p>
          </div>

          {/* Tip Input */}
          <div className="space-y-2">
            <Label htmlFor="tip" className="flex items-center gap-2">
              {t('modifiers.tip')}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{t('modifiers.tipTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {currency.symbol}
              </span>
              <Input
                id="tip"
                type="number"
                step="0.01"
                min="0"
                value={tip || ''}
                onChange={(e) => handleTipChange(e.target.value)}
                placeholder="0.00"
                className="pl-8"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t('modifiers.tipHint')}
            </p>
          </div>
        </div>

        {/* Summary */}
        {(tax > 0 || tip > 0) && (
          <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
            <div className="flex justify-between text-sm">
              <span>{t('modifiers.subtotal')}</span>
              <span>
                {currency.symbol}
                {subtotal.toFixed(2)}
              </span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-sm">
                <span>{t('modifiers.tax')}</span>
                <span>
                  {currency.symbol}
                  {tax.toFixed(2)}
                </span>
              </div>
            )}
            {tip > 0 && (
              <div className="flex justify-between text-sm">
                <span>{t('modifiers.tip')}</span>
                <span>
                  {currency.symbol}
                  {tip.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>{t('modifiers.total')}</span>
              <span>
                {currency.symbol}
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
