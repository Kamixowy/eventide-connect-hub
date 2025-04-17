
import React from 'react';

export interface NewCollaborationDialogProps {
  eventId?: string;
  organizationId?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
