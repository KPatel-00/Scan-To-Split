import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useStore, type Item } from '../store/useStore';
import { feedback } from '../lib/feedback';
import { getDefaultCategory } from '../lib/taxonomy';
import { CategoryEditorPopover } from './CategoryEditorPopover';
import { getCategoryIconComponent, getCategoryDisplayName } from '../lib/taxonomy/helpers';
import type { Category } from '../store/types';

interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  receiptId?: string; // null/undefined for merged mode, specific ID for separate mode
}

export function AddItemDialog({ open, onClose, receiptId }: AddItemDialogProps) {
  const { t, i18n } = useTranslation();
  const currency = useStore((state) => state.currency);
  const addItem = useStore((state) => state.addItem);

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>(getDefaultCategory());

  const locale = (i18n.language || 'de') as 'en' | 'de';
  const CategoryIcon = getCategoryIconComponent(category.icon);
  const categoryName = getCategoryDisplayName(category, locale);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !price.trim()) {
      return;
    }

    // Sanitize input (XSS prevention) - simple trim is safe for plain text rendering
    const sanitizedName = name.trim();
    const parsedQuantity = Math.max(1, parseInt(quantity) || 1);
    const parsedPrice = parseFloat(price) || 0;

    // Create new item
    const newItem: Omit<Item, 'id'> = {
      name: sanitizedName,
      quantity: parsedQuantity,
      price: parsedPrice,
      category: category,
      assignedTo: [],
    };

    // Add to store
    addItem(newItem, receiptId);

    // ✨ PROMPT 9: Success feedback
    feedback.success();

    // Reset form
    setName('');
    setQuantity('1');
    setPrice('');
    setCategory(getDefaultCategory());
    
    // Close dialog
    onClose();
  };

  const handleCancel = () => {
    setName('');
    setQuantity('1');
    setPrice('');
    setCategory(getDefaultCategory());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            {t('setup.itemsList.addItem.title')}
          </DialogTitle>
          <DialogDescription>
            {t('setup.itemsList.addItem.description', {
              defaultValue: 'Add an item manually with its name, quantity, and price.',
            })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Item Name */}
            <div className="grid gap-2">
              <Label htmlFor="item-name">
                {t('setup.itemsList.addItem.name')}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('setup.itemsList.addItem.namePlaceholder')}
                required
                autoFocus
              />
            </div>

            {/* Category Selector */}
            <div className="grid gap-2">
              <Label>
                {t('setup.itemsList.addItem.category', 'Category')}
              </Label>
              <CategoryEditorPopover
                category={category}
                onSave={setCategory}
                onRemove={() => setCategory(getDefaultCategory())}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start h-auto py-3"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CategoryIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{categoryName}</p>
                      <p className="text-xs text-muted-foreground">{category.id}</p>
                    </div>
                  </div>
                </Button>
              </CategoryEditorPopover>
            </div>

            {/* Quantity & Price Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Quantity */}
              <div className="grid gap-2">
                <Label htmlFor="item-quantity">
                  {t('setup.itemsList.addItem.quantity')}
                </Label>
                <Input
                  id="item-quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={t('setup.itemsList.addItem.quantityPlaceholder')}
                />
              </div>

              {/* Price */}
              <div className="grid gap-2">
                <Label htmlFor="item-price">
                  {t('setup.itemsList.addItem.price')}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {currency.symbol}
                  </span>
                  <Input
                    id="item-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={t('setup.itemsList.addItem.pricePlaceholder')}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              {t('setup.itemsList.addItem.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !price.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('setup.itemsList.addItem.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
