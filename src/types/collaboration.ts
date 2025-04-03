
export interface CollaborationType {
  id: string;
  event: {
    id: number | string;
    title: string;
    organization: string;
    date: string;
    image: string;
  };
  sponsor: {
    id: number | string;
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
    id: number | string;
    sender: string;
    text: string;
    date: string;
  }[];
}

export interface CollaborationListProps {
  collaborations: CollaborationType[];
  viewMode: 'grid' | 'list';
  userType: 'organization' | 'sponsor';
  isLoading?: boolean;
}
