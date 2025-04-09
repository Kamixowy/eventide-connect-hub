
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Wait a bit before showing the banner to not disrupt initial UX
      const timer = setTimeout(() => {
        setShow(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
    toast({
      title: "Zgoda na pliki cookie",
      description: "Twoje preferencje zostały zapisane.",
    });
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShow(false);
    // We could clear cookies here if needed
    toast({
      title: "Pliki cookie odrzucone",
      description: "Używamy tylko niezbędnych plików cookie.",
    });
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1">Pliki cookie</h3>
          <p className="text-muted-foreground">
            Używamy plików cookie, aby zapewnić najlepsze doświadczenia na naszej stronie, 
            w tym zapamiętywanie Twoich preferencji wyświetlania. Kliknij "Akceptuj", aby wyrazić zgodę.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={declineCookies}>
            Odrzuć
          </Button>
          <Button className="bg-ngo hover:bg-ngo/90" onClick={acceptCookies}>
            Akceptuj
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShow(false)} className="shrink-0">
            <X size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
