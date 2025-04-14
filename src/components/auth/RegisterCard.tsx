
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RegistrationForm from './RegistrationForm';

interface RegisterCardProps {
  initialAccountType: 'organization' | 'sponsor';
}

const RegisterCard = ({ initialAccountType }: RegisterCardProps) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Rejestracja</CardTitle>
        <CardDescription>
          Stwórz nowe konto w serwisie N-GO
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RegistrationForm initialAccountType={initialAccountType} />
      </CardContent>
    </Card>
  );
};

export default RegisterCard;
