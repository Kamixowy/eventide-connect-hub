
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface EmailGeneratorProps {
  event: any;
}

const EmailGenerator: React.FC<EmailGeneratorProps> = ({ event }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  
  // Format date range for display
  const formatDateRange = () => {
    if (!event.start_date) return '';
    
    const startDate = new Date(event.start_date);
    let dateStr = format(startDate, 'd MMMM yyyy', { locale: pl });
    
    if (event.end_date) {
      const endDate = new Date(event.end_date);
      dateStr += ` - ${format(endDate, 'd MMMM yyyy', { locale: pl })}`;
    }
    
    return dateStr;
  };
  
  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(current => 
      current.includes(optionId) 
        ? current.filter(id => id !== optionId) 
        : [...current, optionId]
    );
  };

  const generateEmailContent = () => {
    const organizationName = event.organization?.name || 'Nasza organizacja';
    const eventTitle = event.title || 'Nasze wydarzenie';
    const location = event.location || 'lokalizacja';
    const dateRange = formatDateRange();
    const attendees = event.attendees || 'wielu';
    
    // Filter selected sponsorship options
    const filteredOptions = event.sponsorshipOptions
      ? event.sponsorshipOptions
        .filter((option: any) => selectedOptions.includes(option.id))
        .map((option: any) => ({
          title: option.title,
          description: option.description,
          price: `${option.price?.from} - ${option.price?.to} PLN`,
          benefits: option.benefits
        }))
      : [];
      
    // Generate email content
    return `
Szanowni Państwo,

Zwracam się z propozycją współpracy przy organizacji wydarzenia "${eventTitle}", organizowanego przez ${organizationName}.

Szczegóły wydarzenia:
- Data: ${dateRange}
- Miejsce: ${location}
- Przewidywana liczba uczestników: ${attendees}
${event.description ? `- Opis: ${event.description}\n` : ''}

${filteredOptions.length > 0 ? `Proponujemy Państwu następujące opcje współpracy:
${filteredOptions.map((opt: any) => `
* ${opt.title} (${opt.price})
  ${opt.description}
  
  Korzyści:
  ${opt.benefits.map((benefit: string) => `  - ${benefit}`).join('\n')}
`).join('\n')}` : ''}

${customMessage ? `\n${customMessage}\n` : ''}

Z poważaniem,
${event.organization?.name || 'Organizator wydarzenia'}
${event.organization?.contact?.email || ''}
${event.organization?.contact?.phone || ''}
    `.trim();
  };
  
  const handleCopyToClipboard = () => {
    const emailContent = generateEmailContent();
    navigator.clipboard.writeText(emailContent);
    toast({
      title: "Skopiowano do schowka",
      description: "Treść wiadomości została skopiowana do schowka",
    });
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Mail size={16} className="mr-2" /> Generuj e-mail dla sponsorów
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Generator e-maila dla sponsorów</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="options" className="mt-4">
          <TabsList>
            <TabsTrigger value="options">Wybierz opcje</TabsTrigger>
            <TabsTrigger value="preview">Podgląd e-maila</TabsTrigger>
          </TabsList>
          
          <TabsContent value="options" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Wybierz opcje sponsorskie</h3>
                <div className="space-y-2">
                  {event.sponsorshipOptions && event.sponsorshipOptions.length > 0 ? (
                    event.sponsorshipOptions.map((option: any) => (
                      <div key={option.id} className="flex items-start space-x-2">
                        <Checkbox 
                          id={`option-${option.id}`} 
                          checked={selectedOptions.includes(option.id)}
                          onCheckedChange={() => handleOptionToggle(option.id)}
                          className="mt-1"
                        />
                        <div className="grid gap-1.5">
                          <Label 
                            htmlFor={`option-${option.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {option.title} ({option.price?.from} - {option.price?.to} PLN)
                          </Label>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Brak dostępnych opcji sponsorskich</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="custom-message" className="text-lg font-medium">
                  Dodatkowa wiadomość (opcjonalne)
                </Label>
                <Textarea 
                  id="custom-message"
                  placeholder="Tutaj możesz dodać dodatkowe informacje, które chcesz przekazać sponsorom"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-[120px] mt-2"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Podgląd wiadomości:</h3>
                <div className="whitespace-pre-wrap bg-muted p-4 rounded-md max-h-[400px] overflow-y-auto text-sm font-mono">
                  {generateEmailContent()}
                </div>
                <Button 
                  className="mt-4 w-full" 
                  onClick={handleCopyToClipboard}
                >
                  <Copy size={16} className="mr-2" /> Kopiuj do schowka
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EmailGenerator;
