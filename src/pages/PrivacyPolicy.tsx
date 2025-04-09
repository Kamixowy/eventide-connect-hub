
import React from 'react';
import Layout from '@/components/layout/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Polityka Prywatności</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">
            Ostatnia aktualizacja: 9 kwietnia 2025
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Wstęp</h2>
          <p className="mb-4">
            Niniejsza Polityka Prywatności wyjaśnia, w jaki sposób zbieramy, używamy, przechowujemy i ujawniamy 
            informacje, które mogą być związane z Tobą jako użytkownikiem naszej platformy. Ochrona Twojej 
            prywatności jest dla nas priorytetem.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Jakie dane zbieramy</h2>
          <p className="mb-2">Możemy zbierać następujące rodzaje danych osobowych:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Dane kontaktowe (imię i nazwisko, adres e-mail, numer telefonu)</li>
            <li>Dane profilu (nazwa użytkownika, zdjęcie profilowe)</li>
            <li>Dane organizacji (nazwa organizacji, opis, dane kontaktowe)</li>
            <li>Dane o wydarzeniach (tytuł, opis, data, lokalizacja)</li>
            <li>Dane o współpracach między organizacjami a sponsorami</li>
            <li>Dane z komunikacji (wiadomości, komentarze)</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Jak wykorzystujemy Twoje dane</h2>
          <p className="mb-2">Wykorzystujemy zebrane dane w następujących celach:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Dostarczanie i utrzymywanie naszych usług</li>
            <li>Usprawnienie i personalizacja korzystania z platformy</li>
            <li>Komunikacja z użytkownikami</li>
            <li>Umożliwienie kontaktu między organizacjami i sponsorami</li>
            <li>Analiza i ulepszanie naszych usług</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Udostępnianie danych</h2>
          <p className="mb-4">
            Nie sprzedajemy ani nie wynajmujemy Twoich danych osobom trzecim. Możemy udostępniać dane w następujących 
            przypadkach:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Za Twoją zgodą</li>
            <li>W celu wypełnienia obowiązków prawnych</li>
            <li>Z dostawcami usług, którzy pomagają nam w prowadzeniu platformy</li>
            <li>W ramach funkcji platformy umożliwiających kontakt między użytkownikami</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Bezpieczeństwo danych</h2>
          <p className="mb-4">
            Stosujemy odpowiednie środki techniczne i organizacyjne, aby chronić Twoje dane przed 
            nieautoryzowanym dostępem, utratą lub niewłaściwym wykorzystaniem.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Twoje prawa</h2>
          <p className="mb-2">Masz prawo do:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Dostępu do swoich danych</li>
            <li>Poprawiania swoich danych</li>
            <li>Usunięcia swoich danych</li>
            <li>Ograniczenia przetwarzania</li>
            <li>Przenoszenia danych</li>
            <li>Sprzeciwu wobec przetwarzania</li>
            <li>Wycofania zgody na przetwarzanie</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Zmiany w Polityce Prywatności</h2>
          <p className="mb-4">
            Możemy aktualizować naszą Politykę Prywatności od czasu do czasu. O wszelkich zmianach będziemy 
            informować poprzez zamieszczenie nowej Polityki Prywatności na tej stronie lub poprzez powiadomienie.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Kontakt</h2>
          <p className="mb-4">
            Jeśli masz pytania dotyczące naszej Polityki Prywatności, skontaktuj się z nami pod adresem: 
            <a href="mailto:kontakt@przyklad.pl" className="text-blue-600">kontakt@przyklad.pl</a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
