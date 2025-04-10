
export interface CollaborationType {
  id: string;
  event?: {
    id: number | string;
    title: string;
    organization: string;
    date: string;
    image: string;
  };
  events?: {
    id: string;
    title: string;
    start_date: string;
    image_url?: string;
    [key: string]: any;
  };
  sponsor?: {
    id: number | string;
    name: string;
    avatar: string;
  };
  organization?: {
    id: string;
    name: string;
    description: string;
    logo_url: string;
    [key: string]: any;
  };
  profiles?: {
    name: string;
    avatar_url: string;
    [key: string]: any;
  };
  status: string;
  createdAt?: string;
  lastUpdated?: string;
  created_at?: string;
  updated_at?: string;
  sponsorshipOptions?: {
    title: string;
    description: string;
    amount: number;
  }[];
  totalAmount?: number;
  total_amount?: number;
  message: string;
  conversation?: {
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
