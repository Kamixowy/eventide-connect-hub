
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { checkConversationParticipation } from '@/services/messages/operations/checkConversationParticipation';

export const useConversationSelection = (initialConversationId?: string | null) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId || null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Validate selected conversation access
    const validateConversationAccess = async () => {
      if (!selectedConversationId) return;

      try {
        // Check if user has access to this conversation
        const hasAccess = await checkConversationParticipation(selectedConversationId);
        
        if (!hasAccess) {
          console.error('User does not have access to this conversation');
          setError('Nie masz dostępu do tej konwersacji');
          setSelectedConversationId(null);
        } else {
          setError(null);
        }
      } catch (error) {
        console.error('Error validating conversation access:', error);
        setError('Wystąpił problem podczas weryfikacji dostępu do konwersacji');
      }
    };

    if (user && selectedConversationId) {
      validateConversationAccess();
    }
  }, [user, selectedConversationId]);

  // Fix: Remove the extra parameter here
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  return {
    selectedConversationId,
    setSelectedConversationId,
    handleConversationSelect,
    error
  };
};
