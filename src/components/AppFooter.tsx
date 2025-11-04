import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function AppFooter() {
  const { t } = useTranslation();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [faqsOpen, setFaqsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleFeedbackSubmit = () => {
    // In a real app, this would send feedback to a backend
    console.log('Feedback submitted:', feedback);
    setFeedback('');
    setFeedbackOpen(false);
  };

  return (
    <>
      <footer className="mt-auto border-t border-border/40 bg-background">
        <div className="container flex flex-col items-center justify-center gap-4 py-8 md:flex-row md:gap-8">
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <Button
              variant="link"
              size="sm"
              onClick={() => setFeedbackOpen(true)}
            >
              {t('footer.feedback')}
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => setFaqsOpen(true)}
            >
              {t('footer.faqs')}
            </Button>
            <Button
              variant="link"
              size="sm"
              asChild
            >
              <a href="mailto:contact@splitter.app">
                {t('footer.contact')}
              </a>
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => setPrivacyOpen(true)}
            >
              {t('footer.privacy')}
            </Button>
          </div>
        </div>
      </footer>

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('footer.feedback')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Tell us what you think..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFeedbackOpen(false)}>
                {t('buttons.cancel')}
              </Button>
              <Button onClick={handleFeedbackSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FAQs Dialog */}
      <Dialog open={faqsOpen} onOpenChange={setFaqsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('footer.faqs')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">How does the AI scanning work?</h4>
              <p className="text-sm text-muted-foreground">
                We use Google&apos;s Gemini AI to analyze your receipt images and extract items, prices, and store information.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Is my data secure?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! All your bill data stays on your device. We only send masked receipt images for AI analysis and never store them.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Can I split items unevenly?</h4>
              <p className="text-sm text-muted-foreground">
                Absolutely! Use the &quot;Split&quot; feature on any item to divide it by amount, percentage, or shares.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('footer.privacy')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">AI Model</h4>
              <p className="text-sm text-muted-foreground">
                Our app uses Google&apos;s Gemini models to provide world-class receipt scanning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">AI Disclaimer</h4>
              <p className="text-sm text-muted-foreground">
                AI is a powerful tool, but not perfect. It may make mistakes, especially with handwritten or faded receipts. Please double-check the scanned items for 100% accuracy.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Data Policy</h4>
              <p className="text-sm text-muted-foreground">
                We send a masked, redacted version of your receipt to our AI partner only for analysis. This data is never stored or used for training. All your personal bill data, groups, and habits stay on your device in your browser&apos;s local storage.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
