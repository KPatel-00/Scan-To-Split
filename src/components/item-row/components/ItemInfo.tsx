import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';
import type { Currency } from '../../../store/useStore';

interface ItemInfoProps {
  // Display mode
  name: string;
  quantity: number;
  price: number;
  currency: Currency;
  isNegativePrice: boolean;
  
  // Edit mode
  isEditing: boolean;
  editedName: string;
  editedQuantity: string;
  editedPrice: string;
  onNameChange: (name: string) => void;
  onQuantityChange: (quantity: string) => void;
  onPriceChange: (price: string) => void;
}

export function ItemInfo({
  name,
  quantity,
  price,
  currency,
  isNegativePrice,
  isEditing,
  editedName,
  editedQuantity,
  editedPrice,
  onNameChange,
  onQuantityChange,
  onPriceChange,
}: ItemInfoProps) {
  return (
    <>
      {/* Item Name */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={editedName}
            onChange={(e) => onNameChange(e.target.value)}
            className="h-8"
          />
        ) : (
          <p className={cn(
            "font-medium truncate",
            isNegativePrice && "text-red-700 dark:text-red-300"
          )}>
            {name}
          </p>
        )}
      </div>

      {/* Quantity */}
      {isEditing ? (
        <Input
          type="number"
          min="1"
          value={editedQuantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          className="w-20 h-8"
        />
      ) : (
        quantity > 1 && (
          <span className="text-sm text-muted-foreground shrink-0">
            {quantity} ×
          </span>
        )
      )}

      {/* Price */}
      <div className="shrink-0">
        {isEditing ? (
          <div className="relative w-28">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {currency.symbol}
            </span>
            <Input
              type="number"
              step="0.01"
              value={editedPrice}
              onChange={(e) => onPriceChange(e.target.value)}
              className="h-8 pl-7"
            />
          </div>
        ) : (
          <p className={cn(
            "font-semibold",
            isNegativePrice && "text-red-700 dark:text-red-300"
          )}>
            {currency.symbol}{price.toFixed(2)}
          </p>
        )}
      </div>
    </>
  );
}
