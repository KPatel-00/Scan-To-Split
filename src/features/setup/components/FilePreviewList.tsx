/**
 * FilePreviewList - Display selected files with thumbnails
 * Shows file cards with remove buttons and summary info
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { feedback } from '@/lib/feedback';

interface FilePreviewListProps {
  files: File[];
  previews: string[];
  isProcessing: boolean;
  onRemoveFile: (index: number) => void;
  onAddMore: () => void;
  onStartScanning: () => void;
}

export function FilePreviewList({
  files,
  previews,
  isProcessing,
  onRemoveFile,
  onAddMore,
  onStartScanning,
}: FilePreviewListProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  const handleRemove = (index: number) => {
    feedback.click();
    onRemoveFile(index);
  };

  return (
    <div className="space-y-4 rounded-xl border-2 border-primary/70 bg-primary/5 p-6">
      {/* File Preview Cards */}
      <AnimatePresence mode="popLayout">
        {files.map((file, index) => (
          <motion.div
            key={`${file.name}-${index}`}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -20 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center gap-4 rounded-lg border border-border bg-background p-4 shadow-sm"
          >
            {/* Image Thumbnail */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={previews[index]}
                alt={file.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-sm">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'Image'}
              </p>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
              className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Summary & Actions */}
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {files.length} receipt{files.length !== 1 ? 's' : ''} ready • Total {formatFileSize(totalSize)}
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onAddMore();
            }}
            disabled={files.length >= 3}
          >
            <Plus className="mr-2 h-4 w-4" />
            {files.length >= 3 ? 'Max 3 receipts' : 'Add More'}
          </Button>

          <Button
            size="lg"
            onClick={onStartScanning}
            disabled={isProcessing || files.length === 0}
            className="gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Start Scanning
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
