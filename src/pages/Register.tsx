
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [accountType, setAccountType] = useState<'organization' | 'sponsor'>(
    (searchParams.get('type') as 'organization' | 'sponsor') || 'organization'
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const type = searchParams.get('type') as 'organization' | 'sponsor';
    if (type === 'organization' || type === 'sponsor') {
      setAccountType(type);
    }
  }, [searchParams]);

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
    
    setIsLoading(true);

    // Symulacja rejestracji
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Rejestracja zakończona pomyślnie",
        description: "Na podany adres email został wysłany link aktywacyjny.",
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="container py-16 max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Rejestracja</CardTitle>
            <CardDescription>
              Stwórz nowe konto w serwisie N-GO
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <RadioGroup 
                value={accountType} 
                onValueChange={(value) => setAccountType(value as 'organization' | 'sponsor')}
                className="grid grid-cols-2 gap-4 mb-6"
              >
                <div>
                  <RadioGroupItem 
                    value="organization" 
                    id="organization" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="organization"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-ngo [&:has([data-state=checked])]:border-ngo"
                  >
                    <span className="text-center font-medium">Organizacja</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="sponsor" 
                    id="sponsor" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="sponsor"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-ngo [&:has([data-state=checked])]:border-ngo"
                  >
                    <span className="text-center font-medium">Sponsor</span>
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Imię</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nazwisko</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
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
            </form>
            
            <div className="mt-6 text-center text-sm">
              Masz już konto?{' '}
              <Link to="/logowanie" className="text-ngo font-semibold hover:underline">
                Zaloguj się
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
