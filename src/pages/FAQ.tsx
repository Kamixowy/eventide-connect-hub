
import React from 'react';
import Layout from '@/components/layout/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Często zadawane pytania (FAQ)</h1>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">
                Czym jest nasza platforma?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Nasza platforma to innowacyjne rozwiązanie łączące organizacje non-profit z potencjalnymi
                sponsorami. Umożliwiamy organizacjom tworzenie profili, publikowanie wydarzeń i pozyskiwanie
                wsparcia, a sponsorom znalezienie wartościowych inicjatyw, które chcieliby wspierać.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">
                Jak założyć konto organizacji?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Aby założyć konto organizacji, wybierz opcję "Rejestracja" w górnym menu, a następnie 
                wybierz typ konta "Organizacja". Wypełnij formularz podając nazwę organizacji, dane 
                kontaktowe oraz inne wymagane informacje. Po weryfikacji, Twoje konto zostanie aktywowane
                i będziesz mógł w pełni korzystać z platformy.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium">
                Jak dodać nowe wydarzenie?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Po zalogowaniu się na konto organizacji, przejdź do sekcji "Moje wydarzenia" i kliknij
                przycisk "Dodaj nowe wydarzenie". Wypełnij wszystkie wymagane pola, dodaj opis, datę,
                lokalizację oraz opcje sponsoringu. Możesz również dodać zdjęcie wydarzenia. Po zapisaniu,
                Twoje wydarzenie będzie widoczne dla potencjalnych sponsorów.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium">
                Jak znaleźć sponsorów dla mojego wydarzenia?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Po dodaniu wydarzenia, będzie ono widoczne w wyszukiwarce dla sponsorów. Możesz również
                aktywnie promować swoje wydarzenie poprzez wysyłanie bezpośrednich wiadomości do potencjalnych
                sponsorów przez naszą platformę. Ważne jest, aby dokładnie opisać wydarzenie i jasno określić
                korzyści dla sponsorów.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium">
                Jak zostać sponsorem?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Aby zostać sponsorem, zarejestruj się wybierając opcję "Sponsor" podczas tworzenia konta.
                Po zalogowaniu możesz przeglądać dostępne wydarzenia, filtrować je według kategorii, lokalizacji
                lub daty. Gdy znajdziesz wydarzenie, które chcesz wesprzeć, możesz skontaktować się z organizatorem
                poprzez platformę.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-medium">
                Czy korzystanie z platformy jest bezpłatne?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Podstawowe funkcje platformy są dostępne bezpłatnie dla wszystkich użytkowników. Obejmuje to
                tworzenie profilu, dodawanie wydarzeń oraz komunikację między organizacjami a sponsorami.
                W przyszłości planujemy wprowadzić plan premium z dodatkowymi funkcjami dla najbardziej
                aktywnych użytkowników.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-medium">
                Jak bezpiecznie nawiązać współpracę?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Nasza platforma umożliwia bezpieczną komunikację między stronami, ale ostateczne umowy są
                zawierane poza platformą. Zalecamy dokładne sprawdzenie potencjalnych partnerów, jasne
                określenie warunków współpracy na piśmie oraz kontakt osobisty przed rozpoczęciem współpracy.
                W razie potrzeby możesz również poprosić o referencje.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-medium">
                Jak mogę modyfikować swój profil?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Po zalogowaniu, kliknij na swoją nazwę użytkownika w górnym menu, a następnie wybierz opcję
                "Profil". Tam znajdziesz przycisk "Edytuj profil", który umożliwi Ci zmianę danych, opisu,
                zdjęcia profilowego oraz innych informacji. Pamiętaj, aby regularnie aktualizować swój profil,
                aby przyciągać więcej potencjalnych partnerów.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-9">
              <AccordionTrigger className="text-lg font-medium">
                Co zrobić, gdy mam problem techniczny?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                W przypadku problemów technicznych, możesz skontaktować się z naszym zespołem wsparcia poprzez
                formularz kontaktowy dostępny w stopce strony lub bezpośrednio pisząc na adres 
                support@przyklad.pl. Postaramy się odpowiedzieć na Twoje zgłoszenie w ciągu 24 godzin.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-10">
              <AccordionTrigger className="text-lg font-medium">
                Jak usunąć swoje konto?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Jeśli chcesz usunąć swoje konto, przejdź do ustawień profilu i wybierz opcję "Usuń konto".
                Zostaniesz poproszony o potwierdzenie tej decyzji. Pamiętaj, że usunięcie konta jest nieodwracalne
                i spowoduje usunięcie wszystkich Twoich danych, wydarzeń i wiadomości z naszej platformy.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
