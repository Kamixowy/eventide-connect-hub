
// For development and testing purposes only
// This will be replaced with real data from the API

export const collaborationsData = [
  {
    id: "1", // Changed from number to string
    event: {
      id: "101",
      title: "Charity Run 2023",
      date: "2023-09-20",
      location: "Warszawa",
      organization: "Fundacja Pomoc Dzieciom"
    },
    sponsor: {
      id: "201",
      name: "Tech Solutions Inc.",
      logo: "https://placehold.co/100x100?text=TS"
    },
    status: "pending",
    message: "Chcielibyśmy wesprzeć wasze wydarzenie. Proponujemy sponsoring w pakiecie Gold.",
    createdAt: "2023-07-10T12:30:00Z",
    lastUpdated: "2023-07-10T12:30:00Z",
    totalAmount: 3000,
    sponsorshipOptions: [
      {
        id: "301",
        title: "Gold Package",
        amount: 3000,
        description: "Logo na banerach, mediach społecznościowych i materiałach drukowanych."
      }
    ]
  },
  {
    id: "2", // Changed from number to string
    event: {
      id: "102",
      title: "Food Festival 2023",
      date: "2023-10-15",
      location: "Kraków",
      organization: "Stowarzyszenie Kulinarne"
    },
    sponsor: {
      id: "202",
      name: "Healthy Foods Co.",
      logo: "https://placehold.co/100x100?text=HF"
    },
    status: "accepted",
    message: "Jesteśmy zainteresowani sponsoringiem waszego festiwalu kulinarnego.",
    createdAt: "2023-07-05T10:15:00Z",
    lastUpdated: "2023-07-08T14:20:00Z",
    totalAmount: 5000,
    sponsorshipOptions: [
      {
        id: "302",
        title: "Platinum Package",
        amount: 5000,
        description: "Stoisko, logo na wszystkich materiałach, wzmianki podczas wydarzenia."
      }
    ]
  },
  {
    id: "3", // Changed from number to string
    event: {
      id: "103",
      title: "Tech Conference 2023",
      date: "2023-11-10",
      location: "Wrocław",
      organization: "IT Progress Foundation"
    },
    sponsor: {
      id: "203",
      name: "Digital Future",
      logo: "https://placehold.co/100x100?text=DF"
    },
    status: "completed",
    message: "Chcemy wesprzeć konferencję w różnych pakietach sponsorskich.",
    createdAt: "2023-06-20T09:00:00Z",
    lastUpdated: "2023-07-01T11:30:00Z",
    totalAmount: 8000,
    sponsorshipOptions: [
      {
        id: "303",
        title: "Silver Package",
        amount: 2000,
        description: "Logo na materiałach cyfrowych i wzmianka podczas otwarcia."
      },
      {
        id: "304",
        title: "Gold Package",
        amount: 3000,
        description: "Logo na banerach, mediach społecznościowych."
      },
      {
        id: "305",
        title: "Special Workshop",
        amount: 3000,
        description: "Prowadzenie dedykowanego warsztatu (90 min)."
      }
    ]
  },
  {
    id: "4", // Changed from number to string
    event: {
      id: "104",
      title: "Eco Festival 2023",
      date: "2023-08-05",
      location: "Poznań",
      organization: "Green Earth Association"
    },
    sponsor: {
      id: "204",
      name: "Sustainable Products",
      logo: "https://placehold.co/100x100?text=SP"
    },
    status: "rejected",
    message: "Propozycja sponsoringu wydarzenia ekologicznego.",
    createdAt: "2023-06-15T15:45:00Z",
    lastUpdated: "2023-06-18T10:20:00Z",
    totalAmount: 1500,
    sponsorshipOptions: [
      {
        id: "306",
        title: "Bronze Package",
        amount: 1500,
        description: "Logo na stronie wydarzenia i materiałach drukowanych."
      }
    ]
  }
];
