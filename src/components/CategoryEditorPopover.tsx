import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { feedback } from '../lib/feedback';
import { getMerchandiseCategories } from '../lib/taxonomy';
import { getCategoryIconComponent, getCategoryDisplayName } from '../lib/taxonomy/helpers';
import type { Category } from '../store/types';

interface CategoryEditorPopoverProps {
  category: Category;
  onSave: (category: Category) => void;
  onRemove: () => void;
  children: React.ReactNode;
}

export function CategoryEditorPopover({
  category,
  onSave,
  onRemove,
  children,
}: CategoryEditorPopoverProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(category);

  const locale = (i18n.language || 'de') as 'en' | 'de';

  // Get all merchandise categories (exclude special lines)
  const allCategories = useMemo(() => getMerchandiseCategories(), []);

  // Group categories by top-level code
  const groupedCategories = useMemo(() => {
    const groups: Record<string, Category[]> = {
      GROC: [],
      RETAIL: [],
      SERVICE: [],
    };

    allCategories.forEach(cat => {
      if (cat.code === 'GROC') {
        groups.GROC.push(cat);
      } else if (['REST', 'SERV', 'TCOM'].includes(cat.code)) {
        groups.SERVICE.push(cat);
      } else {
        groups.RETAIL.push(cat);
      }
    });

    return groups;
  }, [allCategories]);

  // Filter by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return groupedCategories;

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, Category[]> = {
      GROC: [],
      RETAIL: [],
      SERVICE: [],
    };

    Object.entries(groupedCategories).forEach(([group, categories]) => {
      filtered[group] = categories.filter(cat => {
        const nameMatch = locale === 'de' 
          ? cat.name_de.toLowerCase().includes(query)
          : cat.name_en.toLowerCase().includes(query);
        const keywordMatch = cat.keywords?.some(kw => kw.toLowerCase().includes(query));
        return nameMatch || keywordMatch;
      });
    });

    return filtered;
  }, [searchQuery, groupedCategories, locale]);

  const handleSelect = (cat: Category) => {
    setSelectedCategory(cat);
    feedback.click();
  };

  const handleSave = () => {
    onSave(selectedCategory);
    feedback.success();
    setOpen(false);
  };

  const handleRemove = () => {
    onRemove();
    feedback.click();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-1">
              {t('setup.itemsList.categoryEditor.title', 'Edit Category')}
            </h4>
            <p className="text-xs text-muted-foreground">
              {t('setup.itemsList.categoryEditor.description', 'Choose a category for better organization')}
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('setup.itemsList.categoryEditor.searchPlaceholder', 'Search categories...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="p-3 rounded-lg border bg-accent/50">
            <Label className="text-xs text-muted-foreground mb-2 block">
              {t('setup.itemsList.categoryEditor.selected', 'Selected')}
            </Label>
            <CategoryBadge category={selectedCategory} locale={locale} />
          </div>

          <Separator />

          <div className="max-h-96 overflow-y-auto pr-2">
            <Accordion type="multiple" defaultValue={['GROC', 'RETAIL']} className="w-full">
              {filteredCategories.GROC.length > 0 && (
                <AccordionItem value="GROC">
                  <AccordionTrigger className="text-sm font-medium">
                    🛒 {t('categories.groups.grocery', locale === 'de' ? 'Lebensmittel' : 'Grocery & Food')}
                    <Badge variant="secondary" className="ml-2">
                      {filteredCategories.GROC.length}
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2 pt-2">
                      {filteredCategories.GROC.map(cat => (
                        <CategoryButton
                          key={cat.id}
                          category={cat}
                          locale={locale}
                          isSelected={selectedCategory.id === cat.id}
                          onSelect={handleSelect}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {filteredCategories.RETAIL.length > 0 && (
                <AccordionItem value="RETAIL">
                  <AccordionTrigger className="text-sm font-medium">
                    🏪 {t('categories.groups.retail', locale === 'de' ? 'Einzelhandel' : 'Retail & Others')}
                    <Badge variant="secondary" className="ml-2">
                      {filteredCategories.RETAIL.length}
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2 pt-2">
                      {filteredCategories.RETAIL.map(cat => (
                        <CategoryButton
                          key={cat.id}
                          category={cat}
                          locale={locale}
                          isSelected={selectedCategory.id === cat.id}
                          onSelect={handleSelect}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {filteredCategories.SERVICE.length > 0 && (
                <AccordionItem value="SERVICE">
                  <AccordionTrigger className="text-sm font-medium">
                    🔧 {t('categories.groups.service', locale === 'de' ? 'Dienstleistungen' : 'Services')}
                    <Badge variant="secondary" className="ml-2">
                      {filteredCategories.SERVICE.length}
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2 pt-2">
                      {filteredCategories.SERVICE.map(cat => (
                        <CategoryButton
                          key={cat.id}
                          category={cat}
                          locale={locale}
                          isSelected={selectedCategory.id === cat.id}
                          onSelect={handleSelect}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {Object.values(filteredCategories).every(arr => arr.length === 0) && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {t('setup.itemsList.categoryEditor.noResults', 'No categories found')}
              </div>
            )}
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleRemove}
            >
              {t('setup.itemsList.categoryEditor.remove', 'Remove')}
            </Button>
            <Button
              type="button"
              size="sm"
              className="flex-1"
              onClick={handleSave}
            >
              {t('setup.itemsList.categoryEditor.save', 'Save')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CategoryBadge({ category, locale }: { category: Category; locale: 'en' | 'de' }) {
  const Icon = getCategoryIconComponent(category.icon);
  const name = getCategoryDisplayName(category, locale);

  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-background">
      <div className="rounded-full bg-primary/10 p-1.5">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{category.id}</p>
      </div>
    </div>
  );
}

function CategoryButton({
  category,
  locale,
  isSelected,
  onSelect,
}: {
  category: Category;
  locale: 'en' | 'de';
  isSelected: boolean;
  onSelect: (cat: Category) => void;
}) {
  const Icon = getCategoryIconComponent(category.icon);
  const name = getCategoryDisplayName(category, locale);

  return (
    <Button
      type="button"
      variant={isSelected ? 'default' : 'outline'}
      size="sm"
      className="justify-start h-auto py-2"
      onClick={() => onSelect(category)}
    >
      <Icon className="h-4 w-4 mr-2" />
      <span className="text-left flex-1">{name}</span>
    </Button>
  );
}
