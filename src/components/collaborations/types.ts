
import React from 'react';

export interface NewCollaborationDialogProps {
  eventId?: string;
  organizationId?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  selectedOptions?: string[];
}

export interface SponsorshipOption {
  id: string;
  title: string;
  description: string;
  price: number;
  benefits: string[];
  event_id?: string;
}

export interface CollaborationOption {
  title: string;
  description?: string | null;
  amount: number;
  is_custom: boolean;
  sponsorship_option_id?: string;
}
