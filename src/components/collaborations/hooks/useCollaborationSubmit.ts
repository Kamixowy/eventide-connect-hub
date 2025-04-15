
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
    organizationId,
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
      
      // Get current user ID
      const currentUserId = user?.id;
      
      if (!currentUserId) {
        throw new Error("Użytkownik nie jest zalogowany");
      }
      
      console.log("Creating collaboration with:", {
        sponsor_id: currentUserId,
        organization_id: organizationId,
        selectedEventIds,
        selectedOptions
      });
      
      const collaborationId = await createCollaboration(
        {
          sponsor_id: currentUserId, // Use current user ID as sponsor_id
          organization_id: organizationId, // Use organization ID from parameter
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
