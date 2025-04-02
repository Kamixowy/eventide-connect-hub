
import React from 'react';
import { Loader2 } from 'lucide-react';

type LoadingStateProps = {
  message?: string;
};

const LoadingState = ({ message = "Ładowanie..." }: LoadingStateProps) => {
  return (
    <div className="container py-8 text-center">
      <Loader2 className="animate-spin h-8 w-8 mx-auto" />
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default LoadingState;
