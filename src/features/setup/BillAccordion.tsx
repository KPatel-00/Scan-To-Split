import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { Receipt as ReceiptIcon, Calendar, Store, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function BillAccordion() {
  const { t } = useTranslation();
  const receipts = useStore((state) => state.receipts);
  const currency = useStore((state) => state.currency);
  const [expandedBills, setExpandedBills] = useState<string[]>([receipts[0]?.id].filter(Boolean));

  const calculateReceiptTotal = (receiptId: string) => {
    const receipt = receipts.find((r) => r.id === receiptId);
    if (!receipt) return 0;
    
    const itemsTotal = receipt.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return itemsTotal + receipt.tax + receipt.tip;
  };

  if (receipts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ReceiptIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            No bills yet. Scan or add receipts to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ReceiptIcon className="h-5 w-5" />
            {t('setup.multiBill.accordion.title')}
          </CardTitle>
          <Badge variant="secondary">
            {receipts.length} {receipts.length === 1 ? 'Bill' : 'Bills'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          value={expandedBills}
          onValueChange={setExpandedBills}
          className="space-y-4"
        >
          {receipts.map((receipt, index) => {
            const total = calculateReceiptTotal(receipt.id);
            
            return (
              <AccordionItem
                key={receipt.id}
                value={receipt.id}
                className="rounded-lg border bg-card"
              >
                <AccordionTrigger className="px-4 hover:no-underline [&[data-state=open]]:border-b">
                  <div className="flex w-full items-center justify-between pr-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-semibold text-primary">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">
                          {receipt.storeName || `Bill ${index + 1}`}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {receipt.date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(receipt.date).toLocaleDateString()}
                            </span>
                          )}
                          <span>{receipt.items.length} items</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {currency.symbol}
                        {total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-4 pb-4 pt-3">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Receipt Details */}
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="grid gap-2 text-sm">
                        {receipt.storeName && (
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Store className="h-4 w-4" />
                              Store
                            </span>
                            <span className="font-medium">{receipt.storeName}</span>
                          </div>
                        )}
                        {receipt.date && (
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Date
                            </span>
                            <span className="font-medium">
                              {new Date(receipt.date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase text-muted-foreground">
                        Items ({receipt.items.length})
                      </div>
                      <div className="space-y-1">
                        {receipt.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-md bg-background px-3 py-2 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              {item.quantity > 1 && (
                                <span className="text-xs text-muted-foreground">
                                  × {item.quantity}
                                </span>
                              )}
                            </div>
                            <span className="font-medium">
                              {currency.symbol}
                              {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Totals Breakdown */}
                    <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>
                          {currency.symbol}
                          {receipt.items
                            .reduce((sum, item) => sum + item.price * item.quantity, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      {receipt.tax > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax</span>
                          <span>
                            {currency.symbol}
                            {receipt.tax.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {receipt.tip > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tip</span>
                          <span>
                            {currency.symbol}
                            {receipt.tip.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Total</span>
                        <span>
                          {currency.symbol}
                          {total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        Edit Items
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Bill
                      </Button>
                    </div>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
