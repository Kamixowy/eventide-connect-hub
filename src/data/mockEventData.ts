
export const demoEventData = {
  id: 1,
  title: 'Bieg Charytatywny "Pomagamy Dzieciom"',
  organization: {
    id: 101,
    name: 'Fundacja Szczęśliwe Dzieciństwo',
    avatar: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  date: '15.06.2023',
  location: 'Park Centralny, Warszawa, mazowieckie',
  attendees: 350,
  category: 'Charytatywne',
  status: 'Planowane',
  description: 'Bieg charytatywny, z którego całkowity dochód zostanie przeznaczony na pomoc dzieciom w domach dziecka. Wydarzenie skierowane jest zarówno do profesjonalnych biegaczy jak i amatorów. Do wyboru będą trasy o długości 5 km, 10 km oraz półmaraton.\n\nNasza fundacja od ponad 10 lat wspiera dzieci z domów dziecka i rodzin zastępczych. Dzięki zebranym środkom będziemy mogli sfinansować zajęcia dodatkowe, wycieczki edukacyjne oraz materiały szkolne dla podopiecznych.',
  banner: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  audience: ['Rodziny z dziećmi', 'Biegacze amatorzy', 'Sportowcy', 'Firmy', 'Wolontariusze'],
  tags: ['bieg', 'charytatywny', 'pomoc dzieciom', 'sport', 'event sportowy', 'fundacja'],
  socialMedia: {
    facebook: 'https://facebook.com/event',
    linkedin: 'https://linkedin.com/event'
  },
  sponsorshipOptions: [
    {
      id: 1,
      title: 'Partner Główny',
      description: 'Logo na materiałach promocyjnych, bannery na miejscu wydarzenia, miejsce na stoisko, logo na koszulkach uczestników, wyróżnienie podczas ceremonii.',
      price: { from: 5000, to: 10000 },
      benefits: ['Logo na materiałach promocyjnych', 'Bannery na miejscu wydarzenia', 'Miejsce na stoisko', 'Logo na koszulkach uczestników', 'Wyróżnienie podczas ceremonii']
    },
    {
      id: 2,
      title: 'Partner Wspierający',
      description: 'Logo na materiałach promocyjnych, banner na miejscu wydarzenia, wyróżnienie podczas ceremonii.',
      price: { from: 2000, to: 4000 },
      benefits: ['Logo na materiałach promocyjnych', 'Banner na miejscu wydarzenia', 'Wyróżnienie podczas ceremonii']
    },
    {
      id: 3,
      title: 'Partner Medialny',
      description: 'Relacje z wydarzenia, promocja w mediach partnera.',
      price: null,
      benefits: ['Relacje z wydarzenia', 'Promocja w mediach partnera']
    },
    {
      id: 4,
      title: 'Sponsor Nagród',
      description: 'Przekazanie nagród dla uczestników, wyróżnienie podczas ceremonii wręczenia nagród.',
      price: { from: 1000, to: 3000 },
      benefits: ['Przekazanie nagród dla uczestników', 'Wyróżnienie podczas ceremonii wręczenia nagród']
    }
  ],
  updates: []
};

export const statusOptions = [
  "Planowane",
  "W przygotowaniu",
  "W trakcie",
  "Zakończone",
  "Anulowane"
];
