import { useState, useEffect } from 'react';
import { IconButton } from './ui/icon-button';
import { Button } from './ui/button';
import { CustomToggle } from './ui/custom-toggle';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Settings, Volume2, VolumeX, Smartphone, Database, Accessibility, AlertCircle } from 'lucide-react';
import { sound, haptic, feedback } from '../lib/feedback';
import { StorageManagementSettings } from './StorageManagementSettings';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function FeedbackSettings() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setSoundEnabled(sound.isEnabled());
    setHapticEnabled(haptic.isEnabled());
  }, []);

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    sound.setEnabled(enabled);
    if (enabled) {
      sound.toggleSound();
    }
  };

  const handleHapticToggle = (enabled: boolean) => {
    setHapticEnabled(enabled);
    haptic.setEnabled(enabled);
    if (enabled) {
      haptic.selection();
    }
  };

  const handleTestSound = () => {
    feedback.success();
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <IconButton aria-label="Settings">
              <Settings className="h-5 w-5" />
            </IconButton>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage feedback, storage, and app preferences
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="feedback" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feedback" className="gap-2">
              <Volume2 className="h-4 w-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="gap-2">
              <Accessibility className="h-4 w-4" />
              Accessibility
            </TabsTrigger>
            <TabsTrigger value="storage" className="gap-2">
              <Database className="h-4 w-4" />
              Storage
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="feedback" className="space-y-4 mt-4">
            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-primary" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Label htmlFor="sound-toggle" className="text-base font-medium">
                    Sound Effects
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    Premium
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Play subtle sounds for actions and confirmations
                </p>
              </div>
              <CustomToggle
                isOn={soundEnabled}
                onToggle={handleSoundToggle}
                label="Sound Effects"
                size="md"
              />
            </div>

            {/* Haptic Feedback */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <Label htmlFor="haptic-toggle" className="text-base font-medium">
                    Haptic Feedback
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Vibration on mobile devices
                </p>
              </div>
              <CustomToggle
                isOn={hapticEnabled}
                onToggle={handleHapticToggle}
                label="Haptic Feedback"
                size="md"
              />
            </div>

            {/* Test Button */}
            <div className="pt-4">
              <Button
                onClick={handleTestSound}
                variant="outline"
                className="w-full"
                disabled={!soundEnabled && !hapticEnabled}
              >
                Test Feedback
              </Button>
            </div>

            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              💡 These settings are saved locally and persist across sessions.
            </div>
          </TabsContent>
          
          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-4 mt-4">
            {/* Motion Preference Detector */}
            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="flex items-start gap-4">
                <Accessibility className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Motion Preference</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your system preference for reduced motion is being respected.
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant={prefersReducedMotion ? 'default' : 'secondary'}>
                      {prefersReducedMotion ? 'Reduced Motion Enabled' : 'Full Animations Enabled'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {prefersReducedMotion ? (
                <div className="flex items-start gap-2 rounded-md bg-primary/10 p-4 text-sm">
                  <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-primary">
                    All spring animations are automatically simplified to smooth fades for your comfort.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground px-2">
                  You'll experience our premium spring-based physics animations. To enable reduced motion, 
                  change your system accessibility settings.
                </p>
              )}
            </div>

            {/* Skip to Content Info */}
            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="flex items-start gap-4">
                <Accessibility className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Keyboard Navigation</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enhanced keyboard accessibility features are always enabled.
                  </p>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Tab</kbd> on page load to reveal "Skip to Content" link</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>All interactive elements are keyboard accessible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Screen reader support with ARIA labels</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Performance Info */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <h4 className="font-medium text-sm">Performance Optimizations</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>⚡ GPU-accelerated animations</li>
                <li>🎨 Hardware-composited layers</li>
                <li>🚀 60fps+ smooth transitions</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="storage" className="mt-4">
            <StorageManagementSettings />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
