
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AccountTypeSelector from './AccountTypeSelector';

interface RegistrationFormProps {
  initialAccountType: 'organization' | 'sponsor';
}

const RegistrationForm = ({ initialAccountType }: RegistrationFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [accountType, setAccountType] = useState<'organization' | 'sponsor'>(initialAccountType);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Błąd rejestracji",
        description: "Podane hasła nie są identyczne",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Błąd rejestracji",
        description: "Hasło musi mieć co najmniej 6 znaków",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const metadata = {
        name: name,
        userType: accountType,
        companyName
      };
      
      const { error } = await signUp(email, password, metadata);
      
      if (error) {
        toast({
          title: "Błąd rejestracji",
          description: error.message || "Wystąpił problem podczas rejestracji. Spróbuj ponownie później.",
          variant: "destructive",
        });
      } else {
        // Show email verification toast
        toast({
          title: "Rejestracja udana",
          description: "Sprawdź swoją skrzynkę odbiorczą i potwierdź adres email, aby aktywować konto.",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Błąd rejestracji",
        description: error.message || "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <AccountTypeSelector 
        accountType={accountType}
        onChange={setAccountType}
      />
      
      <div className="space-y-2">
        <Label htmlFor="name">Nazwa</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="companyName">
          {accountType === 'organization' ? 'Nazwa organizacji' : 'Nazwa firmy'}
        </Label>
        <Input
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="twoj@email.pl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Hasło</Label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        Klikając "Zarejestruj się" akceptujesz{' '}
        <Link to="/regulamin" className="text-ngo hover:underline">
          Regulamin
        </Link>{' '}
        oraz{' '}
        <Link to="/polityka-prywatnosci" className="text-ngo hover:underline">
          Politykę Prywatności
        </Link>
      </div>
      
      <Button type="submit" className="w-full btn-gradient" disabled={isLoading}>
        {isLoading ? 'Rejestracja...' : 'Zarejestruj się'}
      </Button>

      <div className="mt-6 text-center text-sm">
        Masz już konto?{' '}
        <Link to="/logowanie" className="text-ngo font-semibold hover:underline">
          Zaloguj się
        </Link>
      </div>
    </form>
  );
};

export default RegistrationForm;
