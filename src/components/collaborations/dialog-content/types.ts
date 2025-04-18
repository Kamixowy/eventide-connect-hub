
import { CollaborationOption, SponsorshipOption } from '../types';

export interface CollaborationDialogContentProps {
  isLoading: boolean;
  selectedOptions: CollaborationOption[];
  sponsorshipOptions: SponsorshipOption[];
  organizations: any[];
  events: any[];
  selectedEventIds: string[];
  selectedOrganizationId: string;
  message?: string;
  totalAmount: number;
  toggleOption: (option: SponsorshipOption) => void;
  addCustomOption: () => void;
  removeCustomOption: (index: number) => void;
  updateCustomOption: (index: number, field: keyof CollaborationOption, value: any) => void;
  toggleEvent: (eventId: string) => void;
  handleOrganizationChange: (value: string) => void;
  setMessage?: (message: string) => void;
  handleSubmit: () => void;
  eventId?: string;
}
