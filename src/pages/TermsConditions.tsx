
import React from 'react';
import Layout from '@/components/layout/Layout';

const TermsConditions = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Regulamin</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">
            Ostatnia aktualizacja: 9 kwietnia 2025
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Wprowadzenie</h2>
          <p className="mb-4">
            Niniejszy Regulamin określa zasady korzystania z platformy, która umożliwia organizacjom 
            tworzenie wydarzeń i pozyskiwanie sponsorów. Korzystając z naszej platformy, akceptujesz 
            niniejszy Regulamin w całości.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Definicje</h2>
          <p className="mb-2">W niniejszym Regulaminie:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>"Platforma" oznacza naszą stronę internetową, aplikację i powiązane usługi</li>
            <li>"Organizacja" oznacza podmiot korzystający z Platformy w celu tworzenia wydarzeń</li>
            <li>"Sponsor" oznacza podmiot korzystający z Platformy w celu wspierania wydarzeń</li>
            <li>"Wydarzenie" oznacza aktywność organizowaną przez Organizację</li>
            <li>"Współpraca" oznacza relację między Organizacją a Sponsorem dotyczącą Wydarzenia</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Korzystanie z Platformy</h2>
          <p className="mb-4">
            Aby korzystać z Platformy, musisz:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Mieć ukończone 18 lat lub być pod nadzorem osoby dorosłej</li>
            <li>Zarejestrować konto podając prawdziwe i aktualne informacje</li>
            <li>Chronić swoje dane logowania</li>
            <li>Korzystać z Platformy zgodnie z prawem i niniejszym Regulaminem</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Konta Organizacji</h2>
          <p className="mb-4">
            Organizacje mogą tworzyć profile, dodawać wydarzenia i szukać sponsorów. Organizacje 
            są odpowiedzialne za dokładność informacji o sobie i swoich wydarzeniach. Organizacje 
            zgadzają się na kontakt ze strony potencjalnych Sponsorów.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Konta Sponsorów</h2>
          <p className="mb-4">
            Sponsorzy mogą przeglądać wydarzenia, kontaktować się z Organizacjami i oferować wsparcie. 
            Sponsorzy są odpowiedzialni za wypełnienie swoich zobowiązań wobec Organizacji.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Wydarzenia</h2>
          <p className="mb-4">
            Organizacje mogą tworzyć i publikować wydarzenia. Wydarzenia muszą być opisane dokładnie 
            i zgodnie z prawdą. Platforma nie ponosi odpowiedzialności za organizację, przebieg ani 
            rezultaty wydarzeń.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Współpraca</h2>
          <p className="mb-4">
            Platforma umożliwia nawiązywanie współpracy między Organizacjami a Sponsorami, ale nie jest 
            stroną umów zawieranych między nimi. Organizacje i Sponsorzy są samodzielnie odpowiedzialni 
            za negocjowanie i realizację warunków współpracy.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Zakaz działań zabronionych</h2>
          <p className="mb-4">
            Zabrania się korzystania z Platformy w sposób, który:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Narusza prawo lub prawa osób trzecich</li>
            <li>Jest szkodliwy, oszukańczy lub wprowadzający w błąd</li>
            <li>Zakłóca działanie Platformy</li>
            <li>Obchodzi zabezpieczenia Platformy</li>
            <li>Gromadzi dane innych użytkowników</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Własność intelektualna</h2>
          <p className="mb-4">
            Platforma i jej zawartość są chronione prawem autorskim i innymi prawami własności 
            intelektualnej. Publikując treści na Platformie, udzielasz Platformie licencji na 
            korzystanie z tych treści w związku ze świadczeniem usług.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Odpowiedzialność</h2>
          <p className="mb-4">
            Platforma jest dostarczana "tak jak jest" i nie udzielamy żadnych gwarancji dotyczących 
            jej działania. Nie ponosimy odpowiedzialności za szkody wynikające z korzystania z Platformy.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Zmiany Regulaminu</h2>
          <p className="mb-4">
            Możemy zmienić niniejszy Regulamin w dowolnym momencie. Korzystanie z Platformy po 
            wprowadzeniu zmian oznacza akceptację nowego Regulaminu.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Kontakt</h2>
          <p className="mb-4">
            W przypadku pytań dotyczących Regulaminu, skontaktuj się z nami pod adresem: 
            <a href="mailto:kontakt@przyklad.pl" className="text-blue-600">kontakt@przyklad.pl</a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsConditions;
