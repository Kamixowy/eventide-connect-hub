
// Status options for collaborations
export const COLLABORATION_STATUSES = {
  PENDING: 'pending',    // Oczekująca
  SENT: 'pending',       // Wysłana (używamy tej samej wartości 'pending' dla wysłanej jak dla oczekującej)
  ACCEPTED: 'accepted',  // Zaakceptowana
  REJECTED: 'rejected',  // Odrzucona
  COMPLETED: 'completed' // Zakończona
};

// Status display names in Polish
export const COLLABORATION_STATUS_NAMES = {
  'pending': 'Oczekująca',
  'accepted': 'Zaakceptowana',
  'rejected': 'Odrzucona',
  'completed': 'Zakończona'
};

// Collaboration status colors for UI
export const COLLABORATION_STATUS_COLORS = {
  'pending': 'bg-blue-100 text-blue-800',
  'accepted': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800',
  'completed': 'bg-purple-100 text-purple-800'
};
