
export const COLLABORATION_STATUSES = {
  pending: 'pending',
  accepted: 'accepted',
  rejected: 'rejected',
  negotiation: 'negotiation',
  completed: 'completed',
  canceled: 'canceled'
} as const;

export type CollaborationStatus = keyof typeof COLLABORATION_STATUSES;
