
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createCollaboration } from '@/services/collaborations';
import { CollaborationOption } from '../types';

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
  }: {
    organizationId: string;
    message: string;
    totalAmount: number;
    selectedOptions: CollaborationOption[];
    selectedEventIds: string[];
  }) => {
    if (!user?.id) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany aby wysłać propozycję współpracy",
        variant: "destructive"
      });
      return null;
    }

    if (!organizationId || selectedEventIds.length === 0 || selectedOptions.length === 0) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie wymagane pola",
        variant: "destructive"
      });
      return null;
    }

    try {
      setIsLoading(true);
      
      const collaborationId = await createCollaboration(
        user.id,
        organizationId,
        message,
        totalAmount,
        selectedOptions,
        selectedEventIds
      );
      
      toast({
        title: "Sukces",
        description: "Propozycja współpracy została wysłana"
      });
      
      return collaborationId;
    } catch (error: any) {
      console.error('Error submitting collaboration:', error);
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się wysłać propozycji współpracy",
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
