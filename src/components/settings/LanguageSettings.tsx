import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { feedback } from '../../lib/feedback';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export function LanguageSettings() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    feedback.success();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t('settings.language.title', 'Language')}
        </CardTitle>
        <CardDescription>
          {t('settings.language.description', 'Choose your preferred language')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {LANGUAGES.map((lang) => {
            const isActive = i18n.language === lang.code || i18n.language.startsWith(lang.code);
            return (
              <Button
                key={lang.code}
                variant={isActive ? 'default' : 'outline'}
                className="justify-between h-auto py-3"
                onClick={() => handleLanguageChange(lang.code)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </div>
                {isActive && (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Auto-detect info */}
        <div className="mt-4 p-3 rounded-md bg-muted/50">
          <p className="text-xs text-muted-foreground">
            {t('settings.language.autoDetect', 'Language is auto-detected from your browser. Your preference is saved.')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
