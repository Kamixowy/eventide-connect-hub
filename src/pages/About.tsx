
import React from 'react';
import { MoveRight, Award, Users, Target, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';

const About = () => {
  return (
    <Layout>
      <div className="relative py-12 bg-gradient-to-b from-blue-50 to-transparent">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">O nas</h1>
            <p className="text-lg text-muted-foreground">
              N-GO to platforma łącząca organizacje pozarządowe ze sponsorami, ułatwiająca nawiązywanie współpracy i realizację wartościowych projektów.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nasza misja</h2>
              <p className="text-lg mb-4">
                Wierzymy, że połączenie sił biznesu i organizacji non-profit może przynieść ogromne korzyści społeczne. Naszą misją jest ułatwienie tego procesu poprzez stworzenie miejsca, w którym obie strony mogą się odnaleźć.
              </p>
              <p className="text-lg mb-6">
                Chcemy, aby każda organizacja, niezależnie od jej wielkości, miała równe szanse na pozyskanie partnerów biznesowych, a firmy mogły w łatwy sposób znaleźć projekty, które najlepiej odpowiadają ich celom CSR.
              </p>
              <Button className="btn-gradient group">
                Poznaj nasz zespół <MoveRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="hidden md:flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Zespół N-GO" 
                className="rounded-lg shadow-xl max-w-md"
              />
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Nasze wartości</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Heart size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Społeczne zaangażowanie</h3>
                  <p className="text-muted-foreground">
                    Wierzymy, że biznes może i powinien przyczyniać się do pozytywnych zmian społecznych. Wspieramy projekty, które mają realny wpływ na społeczności.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                    <Award size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Przejrzystość</h3>
                  <p className="text-muted-foreground">
                    Dbamy o to, aby wszystkie działania były transparentne, a informacje o projektach i współpracach były jasne i dostępne dla wszystkich zainteresowanych.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Users size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Współpraca</h3>
                  <p className="text-muted-foreground">
                    Wierzymy w siłę współdziałania. Łączymy organizacje i firmy, które mają wspólne cele i wartości, aby razem mogły osiągnąć więcej.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Innowacyjność</h3>
                  <p className="text-muted-foreground">
                    Stale rozwijamy naszą platformę, szukając nowych rozwiązań, które ułatwią nawiązywanie i prowadzenie współpracy między NGO a biznesem.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Nasza historia</h2>
                <p className="mb-4">
                  N-GO powstało w 2021 roku jako odpowiedź na potrzebę stworzenia mostu między światem biznesu a organizacjami pozarządowymi. Założyciele, mający doświadczenie w obu tych światach, zauważyli brak efektywnego narzędzia, które ułatwiałoby nawiązywanie współpracy.
                </p>
                <p className="mb-4">
                  Od momentu powstania, platforma stale się rozwija, dodając nowe funkcjonalności i usprawniając proces nawiązywania współpracy. Dziś N-GO to społeczność organizacji i sponsorów, którzy wspólnie realizują projekty mające realny wpływ na otaczającą nas rzeczywistość.
                </p>
                <p>
                  Dołącz do nas i razem twórzmy lepszą przyszłość!
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Historia N-GO" 
                  className="rounded-lg shadow-xl max-w-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
