
import React from 'react';
import Layout from '@/components/layout/Layout';
import MessagesContainer from '@/components/messages/MessagesContainer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Messages = () => {
  return (
    <Layout>
      <div className="container py-6">
        <Alert variant="info" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informacja o wiadomościach</AlertTitle>
          <AlertDescription>
            Tutaj znajdziesz wiadomości związane z Twoimi współpracami. Aby rozpocząć nową konwersację, 
            najpierw utwórz propozycję współpracy.
          </AlertDescription>
        </Alert>
        <MessagesContainer />
      </div>
    </Layout>
  );
};

export default Messages;
