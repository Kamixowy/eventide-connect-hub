
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserTypeGuardProps {
  allowedTypes: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const UserTypeGuard: React.FC<UserTypeGuardProps> = ({
  allowedTypes,
  children,
  fallback = null,
}) => {
  const { user } = useAuth();
  
  const userType = user?.user_metadata?.userType || null;
  
  if (!user || !userType || !allowedTypes.includes(userType)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default UserTypeGuard;
