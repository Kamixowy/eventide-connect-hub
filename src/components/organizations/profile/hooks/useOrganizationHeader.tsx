
import { useState } from 'react';

export const useOrganizationHeader = () => {
  const getUserType = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('sb-user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          return userData?.user_metadata?.userType || null;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  };

  const userType = getUserType();
  const isOrganizationUser = userType === 'organization';

  return {
    getUserType,
    isOrganizationUser
  };
};

export default useOrganizationHeader;
