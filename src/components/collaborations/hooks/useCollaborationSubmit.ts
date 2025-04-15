
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createCollaboration } from '@/services/collaborations';
import { COLLABORATION_STATUSES } from '@/services/collaborations/utils';
import { CollaborationOption } from '../types';

export interface SubmitCollaborationParams {
  sponsorId: string;
  organizationId: string;
  eventId: string;
  message: string;
  totalAmount: number;
  selectedOptions: CollaborationOption[];
  selectedEventIds: string[];
}

export const useCollaborationSubmit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const submitCollaboration = async ({
    sponsorId,
    organizationId,
    eventId,
    message,
    totalAmount,
    selectedOptions,
    selectedEventIds
  }: SubmitCollaborationParams) => {
    if (!organizationId) {
      toast({
        title: "Błąd",
        description: "Wybierz organizację",
        variant: "destructive"
      });
      return null;
    }
    
    if (selectedOptions.length === 0) {
      toast({
        title: "Błąd",
        description: "Wybierz przynajmniej jedną opcję współpracy",
        variant: "destructive"
      });
      return null;
    }
    
    if (selectedEventIds.length === 0) {
      toast({
        title: "Błąd",
        description: "Wybierz przynajmniej jedno wydarzenie",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsLoading(true);
      
      // Make sure we're using the correct IDs:
      // - For sponsor: use the current user ID
      // - For organization: use the organization ID (not user ID)
      const currentUserId = user?.id;
      
      if (!currentUserId) {
        throw new Error("Użytkownik nie jest zalogowany");
      }
      
      const collaborationId = await createCollaboration(
        {
          sponsor_id: currentUserId, // Always use the current user ID for sponsor
          organization_id: organizationId, // Use the organization ID, not user ID
          event_id: selectedEventIds[0],
          status: COLLABORATION_STATUSES.PENDING,
          message: message,
          total_amount: totalAmount
        },
        selectedOptions,
        selectedEventIds
      );
      
      toast({
        title: "Sukces",
        description: "Propozycja współpracy została wysłana"
      });
      
      return collaborationId;
    } catch (error: any) {
      console.error('Błąd podczas tworzenia współpracy:', error);
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się utworzyć współpracy",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitCollaboration
  };
};
