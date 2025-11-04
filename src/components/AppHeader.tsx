import { Link } from 'react-router-dom';
import { Languages, TrendingUp, BarChart3, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { FeedbackSettings } from './FeedbackSettings';
import { SessionInsightsModal } from '../features/summary/SessionInsightsModal';
import { ThemeToggle } from './ThemeToggle';
import { IconButton } from './ui/icon-button';
import { useStore } from '../store/useStore';
import { feedback } from '../lib/feedback';

export function AppHeader() {
  const { i18n } = useTranslation();
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);
  
  // ✨ REFACTORED: Get modal action from store instead of useState
  const openSessionInsightsModal = useStore((state) => state.openSessionInsightsModal);

  const toggleLanguage = (lang: 'en' | 'de') => {
    feedback.select();
    setLanguage(lang);
    i18n.changeLanguage(lang); // Sync with i18next
  };

  const handleOpenInsights = () => {
    feedback.click();
    openSessionInsightsModal(); // ✨ No more setInsightsOpen(true)
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          {/* Logo + Brand - Enhanced with icon and better typography */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group transition-opacity hover:opacity-80"
            onClick={() => feedback.click()}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">Splitter</span>
          </Link>

          <TooltipProvider>
            <div className="flex items-center gap-2">
              {/* Analytics Button - Premium */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/analytics">
                    <IconButton aria-label="View Analytics">
                      <BarChart3 className="h-5 w-5" />
                    </IconButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Analytics</p>
                </TooltipContent>
              </Tooltip>

              {/* Session Insights Button - Premium */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton onClick={handleOpenInsights} aria-label="View Session Insights">
                    <TrendingUp className="h-5 w-5" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Session Insights</p>
                </TooltipContent>
              </Tooltip>

              {/* Language Toggle - Premium */}
              <Tooltip>
                <DropdownMenu>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <IconButton aria-label="Change language">
                        <Languages className="h-5 w-5" />
                      </IconButton>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => toggleLanguage('en')}
                      className={language === 'en' ? 'bg-accent' : ''}
                    >
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleLanguage('de')}
                      className={language === 'de' ? 'bg-accent' : ''}
                    >
                      Deutsch
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <TooltipContent>
                  <p>Change language</p>
                </TooltipContent>
              </Tooltip>

              {/* Feedback Settings - Premium */}
              <FeedbackSettings />

              {/* Theme Toggle - Premium */}
              <ThemeToggle />
            </div>
          </TooltipProvider>
        </div>
      </header>

      {/* Session Insights Modal - ✨ No more props! */}
      <SessionInsightsModal />
    </>
  );
}
