
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEventFetching } from '@/hooks/useEventFetching';
import { useEventActions } from '@/hooks/useEventActions';
import { statusOptions } from '@/data/mockEventData';

export const useEventDetails = (eventId: string | undefined) => {
  const { user } = useAuth();
  
  const { 
    event, 
    loading, 
    isOwner, 
    fetchEventDetails 
  } = useEventFetching(eventId, user?.id);
  
  const {
    statusUpdating,
    showPostForm,
    setShowPostForm,
    handleStatusChange,
    handlePostSuccess,
    handleCopyLink,
    handleContactOrganization
  } = useEventActions(eventId, fetchEventDetails);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return {
    event,
    loading,
    isOwner,
    statusUpdating,
    showPostForm,
    statusOptions,
    setShowPostForm,
    handleStatusChange,
    handlePostSuccess,
    fetchEventDetails,
    handleCopyLink,
    handleContactOrganization
  };
};
