
export interface SponsorshipOption {
  id: string;
  title: string;
  description: string | null;
  price: number;
  benefits: string[] | null;
}

export interface NewCollaborationDialogProps {
  eventId?: string;
  organizationId?: string;
  children: React.ReactNode;
}
