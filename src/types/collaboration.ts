
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
    id: string;
    name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  organization?: {
    id: string;
    name: string;
    description: string;
    logo_url: string;
    [key: string]: any;
  };
  profiles?: {
    id?: string;
    name?: string;
    avatar_url?: string;
    [key: string]: any;
  }[];
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
  settlement_file?: string;
  conversation?: {
    id: number | string;
    sender: string;
    text: string;
    date: string;
  }[];
  collaboration_options?: {
    id: string;
    title: string;
    description?: string | null;
    amount: number;
    is_custom: boolean;
    sponsorship_option_id?: string;
  }[];
  options?: {
    id: string;
    title: string;
    description?: string | null;
    amount: number;
    is_custom: boolean;
    sponsorship_option_id?: string;
  }[];
}

export interface CollaborationListProps {
  collaborations: CollaborationType[];
  viewMode: 'grid' | 'list';
  userType: 'organization' | 'sponsor';
  isLoading?: boolean;
}
