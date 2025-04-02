
export interface CollaborationType {
  id: number;
  event: {
    id: number;
    title: string;
    organization: string;
    date: string;
    image: string;
  };
  sponsor: {
    id: number;
    name: string;
    avatar: string;
  };
  status: string;
  createdAt: string;
  lastUpdated: string;
  sponsorshipOptions: {
    title: string;
    description: string;
    amount: number;
  }[];
  totalAmount: number;
  message: string;
  conversation: {
    id: number;
    sender: string;
    text: string;
    date: string;
  }[];
}
