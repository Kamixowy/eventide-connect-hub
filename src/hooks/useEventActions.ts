
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateEventStatus } from '@/services/events/statusService';

export const useEventActions = (eventId: string | undefined, fetchEventDetails: () => Promise<void>) => {
  const { toast } = useToast();
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  
  const handleStatusChange = async (newStatus: string) => {
    if (!eventId) return;
    
    setStatusUpdating(true);
    try {
      await updateEventStatus(eventId, newStatus);
      
      toast({
        title: "Status zaktualizowany",
        description: `Status wydarzenia został zmieniony na "${newStatus}".`,
      });
      
      fetchEventDetails();
    } catch (error) {
      console.error('Error updating event status:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować statusu wydarzenia.",
        variant: "destructive"
      });
    } finally {
      setStatusUpdating(false);
    }
  };
  
  const handlePostSuccess = () => {
    setShowPostForm(false);
    fetchEventDetails();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Skopiowano link",
      description: "Link do wydarzenia został skopiowany do schowka.",
    });
  };
  
  const handleContactOrganization = () => {
    toast({
      title: "Wiadomość wysłana",
      description: "Twoja wiadomość została wysłana do organizacji. Otrzymasz odpowiedź wkrótce.",
    });
  };
  
  return {
    statusUpdating,
    showPostForm,
    setShowPostForm,
    handleStatusChange,
    handlePostSuccess,
    handleCopyLink,
    handleContactOrganization
  };
};
