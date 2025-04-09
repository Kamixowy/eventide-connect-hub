
import React from 'react';
import Layout from '@/components/layout/Layout';

const CookiePolicy = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Polityka Cookie</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">
            Ostatnia aktualizacja: 9 kwietnia 2025
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Czym są pliki cookie?</h2>
          <p className="mb-4">
            Pliki cookie to małe pliki tekstowe przechowywane na Twoim urządzeniu (komputerze, 
            telefonie lub tablecie), które pozwalają nam rozpoznać Twoje urządzenie podczas 
            korzystania z naszej platformy. Pliki cookie pomagają nam zapewnić prawidłowe 
            działanie platformy, poprawić jej funkcjonalność i dostosować treści do Twoich preferencji.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Jakie pliki cookie wykorzystujemy?</h2>
          <p className="mb-4">
            Wykorzystujemy następujące rodzaje plików cookie:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Niezbędne pliki cookie</strong> - są konieczne do funkcjonowania platformy</li>
            <li><strong>Funkcjonalne pliki cookie</strong> - zapamiętują Twoje preferencje (np. preferowany widok listy lub kafelek)</li>
            <li><strong>Analityczne pliki cookie</strong> - zbierają informacje o tym, jak korzystasz z platformy</li>
            <li><strong>Marketingowe pliki cookie</strong> - pozwalają nam spersonalizować reklamy</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Cele wykorzystania plików cookie</h2>
          <p className="mb-4">
            Wykorzystujemy pliki cookie w następujących celach:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Zapewnienie prawidłowego działania platformy</li>
            <li>Zapamiętywanie Twoich preferencji (np. wybranego trybu wyświetlania)</li>
            <li>Umożliwienie zalogowania i utrzymania sesji</li>
            <li>Analiza ruchu i zachowań użytkowników</li>
            <li>Dostosowanie treści i funkcji do Twoich potrzeb</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Szczegółowe informacje o plikach cookie</h2>
          <p className="mb-4">
            Niektóre konkretne pliki cookie, które wykorzystujemy:
          </p>
          <table className="min-w-full border mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border text-left">Nazwa</th>
                <th className="py-2 px-4 border text-left">Cel</th>
                <th className="py-2 px-4 border text-left">Okres przechowywania</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border">session</td>
                <td className="py-2 px-4 border">Utrzymanie sesji użytkownika</td>
                <td className="py-2 px-4 border">Sesja</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">view_preference</td>
                <td className="py-2 px-4 border">Zapamiętanie wybranego widoku (lista/kafelki)</td>
                <td className="py-2 px-4 border">1 rok</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">cookie_consent</td>
                <td className="py-2 px-4 border">Zapamiętanie zgody na pliki cookie</td>
                <td className="py-2 px-4 border">1 rok</td>
              </tr>
            </tbody>
          </table>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Zarządzanie plikami cookie</h2>
          <p className="mb-4">
            Możesz kontrolować i zarządzać plikami cookie na kilka sposobów:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Poprzez ustawienia przeglądarki internetowej</li>
            <li>Poprzez zewnętrzne narzędzia do zarządzania plikami cookie</li>
            <li>Poprzez panel preferencji na naszej platformie</li>
          </ul>
          <p className="mb-4">
            Większość przeglądarek pozwala:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Wyświetlać pliki cookie przechowywane na Twoim urządzeniu i usuwać poszczególne pliki</li>
            <li>Blokować pliki cookie firm trzecich</li>
            <li>Blokować pliki cookie z określonych witryn</li>
            <li>Blokować wszystkie pliki cookie</li>
            <li>Usuwać wszystkie pliki cookie po zamknięciu przeglądarki</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Konsekwencje wyłączenia plików cookie</h2>
          <p className="mb-4">
            Wyłączenie plików cookie może spowodować, że niektóre funkcje platformy nie będą działać 
            prawidłowo. Na przykład, nie będziemy w stanie zapamiętać Twoich preferencji dotyczących 
            widoku (lista/kafelki) lub utrzymać Cię w stanie zalogowanym podczas przeglądania różnych 
            stron.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Zmiany w Polityce Cookie</h2>
          <p className="mb-4">
            Możemy aktualizować naszą Politykę Cookie od czasu do czasu. O wszelkich zmianach będziemy 
            informować poprzez zamieszczenie nowej Polityki Cookie na tej stronie lub poprzez powiadomienie.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Kontakt</h2>
          <p className="mb-4">
            Jeśli masz pytania dotyczące naszej Polityki Cookie, skontaktuj się z nami pod adresem: 
            <a href="mailto:kontakt@przyklad.pl" className="text-blue-600">kontakt@przyklad.pl</a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CookiePolicy;
