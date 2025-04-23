import React from 'react';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  MessageSquare, 
  Send 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Wiadomość wysłana",
      description: "Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.",
    });
    // Reset form
    e.currentTarget.reset();
  };

  return (
    <Layout>
      <article className="container py-12">
        <header className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Kontakt</h1>
          <p className="text-lg text-muted-foreground">
            Masz pytania? Jesteśmy tutaj, aby pomóc. Skontaktuj się z nami w dowolny sposób.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Adres</h3>
              <p className="text-muted-foreground">ul. Przykładowa 123</p>
              <p className="text-muted-foreground">00-001 Warszawa</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">kontakt@n-go.pl</p>
              <p className="text-muted-foreground">info@n-go.pl</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Telefon</h3>
              <p className="text-muted-foreground">+48 123 456 789</p>
              <p className="text-muted-foreground">+48 987 654 321</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Skontaktuj się z nami</h2>
            <p className="text-muted-foreground mb-6">
              Wypełnij formularz, a odpowiemy na Twoje pytanie najszybciej jak to możliwe. Możesz też skontaktować się z nami bezpośrednio telefonicznie lub mailowo.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="mr-3 text-ngo" size={20} />
                <div>
                  <p className="font-medium">Godziny pracy</p>
                  <p className="text-sm text-muted-foreground">Poniedziałek - Piątek: 9:00 - 17:00</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MessageSquare className="mr-3 text-ngo" size={20} />
                <div>
                  <p className="font-medium">Obsługa klienta</p>
                  <p className="text-sm text-muted-foreground">Odpowiadamy w ciągu 24 godzin w dni robocze</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Imię i nazwisko</label>
                      <Input id="name" placeholder="Jan Kowalski" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input id="email" type="email" placeholder="jan@example.com" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <label htmlFor="subject" className="text-sm font-medium">Temat</label>
                    <Input id="subject" placeholder="W czym możemy pomóc?" required />
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <label htmlFor="message" className="text-sm font-medium">Wiadomość</label>
                    <Textarea 
                      id="message" 
                      placeholder="Opisz szczegółowo swoją sprawę..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full btn-gradient">
                    <Send size={16} className="mr-2" /> Wyślij wiadomość
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-md">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.427998226029!2d21.012275376976813!3d52.22977636388593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc8c92692e49%3A0xc2e97552fd3126e!2sPa%C5%82ac%20Kultury%20i%20Nauki!5e0!3m2!1spl!2spl!4v1692450321238!5m2!1spl!2spl" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa lokalizacji"
          ></iframe>
        </div>
      </article>
    </Layout>
  );
};

export default Contact;
