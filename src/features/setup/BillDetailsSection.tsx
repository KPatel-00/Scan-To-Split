import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Upload, Plus, HelpCircle, Sparkles, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { IconButton } from '../../components/ui/icon-button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { useToast } from '../../hooks/useToast';
import { feedback } from '../../lib/feedback';
import { useStore } from '../../store/useStore';
import { getDefaultCategory } from '../../lib/taxonomy';
import { smoothSlow } from '@/lib/motion/physics';

interface BillDetailsSectionProps {
  managementMode: 'merged' | 'separate';
  onFileUpload: (files: FileList | null) => void;
}

export function BillDetailsSection({ managementMode, onFileUpload }: BillDetailsSectionProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [storeName, setStoreName] = useState('');
  const [date, setDate] = useState('');
  const [manualText, setManualText] = useState('');

  const addItem = useStore((state) => state.addItem);

  const handleManualEntry = async () => {
    if (!manualText.trim()) {
      feedback.error();
      toast({
        title: t('messages.emptyText', 'No text entered'),
        description: t('messages.emptyTextDesc', 'Please paste or type your items.'),
        variant: 'destructive',
      });
      return;
    }

    try {
      feedback.scan();
      
      // Simple parsing: lines with format "Item Name 1.99" or "Item Name - 1.99"
      const lines = manualText.split('\n').filter((line) => line.trim());
      let itemsAdded = 0;

      lines.forEach((line) => {
        // Match patterns like "Item Name 1.99" or "Item Name - €1.99"
        const match = line.match(/^(.+?)[\s-]+[€$£]?([\d,.]+)$/);
        if (match) {
          const name = match[1].trim();
          const price = parseFloat(match[2].replace(',', '.'));
          
          if (name && !isNaN(price)) {
            addItem({
              name,
              quantity: 1,
              price,
              category: getDefaultCategory(),
            });
            itemsAdded++;
          }
        }
      });

      if (itemsAdded > 0) {
        feedback.success();
        toast({
          title: t('messages.manualSuccess', 'Success!'),
          description: t('messages.itemsAdded', { count: itemsAdded }),
        });
        setManualText(''); // Clear the textarea
      } else {
        feedback.error();
        toast({
          title: t('messages.noItemsFound', 'No items found'),
          description: t('messages.noItemsFoundDesc', 'Please check the format. Example: "Coffee 3.50"'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      feedback.error();
      toast({
        title: t('messages.parseError', 'Failed to parse items'),
        description: t('messages.parseErrorDesc', 'Please try again.'),
        variant: 'destructive',
      });
    }
  };

  const handleTryDemo = () => {
    feedback.click();
    const clearSession = useStore.getState().clearSession;
    const addParticipant = useStore.getState().addParticipant;
    const setMergedBillInfo = useStore.getState().setMergedBillInfo;
    
    clearSession();
    
    addParticipant('Lukas');
    addParticipant('Sophie');
    addParticipant('Finn');
    
    setMergedBillInfo('ALDI SÜD', '2025-10-21');
    
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smoothSlow, delay: 0.1 }}
    >
      <Card className="overflow-hidden shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              {t('setup.billDetails.title')}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton className="h-8 w-8" aria-label="Help">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    {t(
                      'billDetails.tooltip',
                      'Supported formats: JPG, PNG, HEIC. Max 3 receipts. File size optimized automatically.'
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="scan">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="scan">{t('setup.billDetails.scanReceipt')}</TabsTrigger>
              <TabsTrigger
                value="manual"
                disabled={managementMode === 'separate'}
              >
                {t('setup.billDetails.enterManually')}
              </TabsTrigger>
            </TabsList>
            
            {/* Scan Receipt Tab */}
            <TabsContent value="scan" className="space-y-6 mt-0">
              <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-gradient-to-br from-muted/20 to-muted/40 p-12 transition-all hover:border-primary/50 hover:from-muted/30 hover:to-muted/50 hover:shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 rounded-full bg-background px-4 py-1.5 shadow-sm ring-1 ring-border">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {t('setup.billDetails.privacyProtected', 'Privacy Protected')}
                    </span>
                  </div>
                </div>
                
                <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-center font-medium">
                  {t('setup.billDetails.dropzone')}
                </p>
                <p className="mb-6 text-center text-xs text-muted-foreground">
                  {t('setup.billDetails.dropzoneHint', 'Images are compressed and scanned for sensitive data automatically')}
                </p>
                <input
                  type="file"
                  accept="image/*,.heic"
                  multiple
                  onChange={(e) => onFileUpload(e.target.files)}
                  className="hidden"
                  id="receipt-upload"
                />
                <label htmlFor="receipt-upload">
                  <Button size="lg" className="shadow-sm" asChild>
                    <span>
                      <Upload />
                      {t('setup.billDetails.chooseFiles', 'Choose Files')}
                    </span>
                  </Button>
                </label>
              </div>

              {/* Try Demo Link */}
              <div className="flex items-center justify-center">
                <button
                  onClick={handleTryDemo}
                  className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span>
                    {t('setup.billDetails.tryDemo', 'Want to see an example?')}{' '}
                    <span className="font-medium underline decoration-primary/30 underline-offset-4 transition-colors group-hover:decoration-primary">
                      {t('setup.billDetails.tryDemoBold', 'Try our demo bill.')}
                    </span>
                  </span>
                </button>
              </div>
            </TabsContent>
            
            {/* Enter Manually Tab */}
            <TabsContent value="manual" className="space-y-6 mt-0">
              {managementMode === 'separate' ? (
                <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 text-center">
                  <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {t(
                      'billDetails.manualDisabled',
                      'Manual entry is disabled in separate mode.'
                    )}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t(
                      'billDetails.manualDisabledHint',
                      'Please add items directly to a specific bill below.'
                    )}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {t('setup.billDetails.storeName')}
                      </label>
                      <Input
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="ALDI SÜD"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {t('setup.billDetails.date')}
                      </label>
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('setup.billDetails.itemList', 'Item-Price List')}
                    </label>
                    <Textarea
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder={t(
                        'billDetails.itemListPlaceholder',
                        'Coffee 3.50\nSandwich 5.99\nOrange Juice 2.50'
                      )}
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t(
                        'billDetails.itemListHint',
                        'Format: Item name followed by price (one per line)'
                      )}
                    </p>
                  </div>

                  <Button
                    onClick={handleManualEntry}
                    className="w-full"
                    size="lg"
                  >
                    <Plus />
                    {t('setup.billDetails.addItems', 'Add Items')}
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
