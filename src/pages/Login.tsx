
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Symulacja logowania
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Zalogowano pomyślnie",
        description: "Przekierowujemy Cię do panelu...",
      });
    }, 1500);
  };

  const handleDemoLogin = (type: 'organization' | 'sponsor') => {
    setIsLoading(true);
    
    // Symulacja logowania demo
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: `Zalogowano jako demo ${type === 'organization' ? 'organizacji' : 'sponsora'}`,
        description: "Przekierowujemy Cię do panelu...",
      });
    }, 1000);
  };

  return (
    <Layout>
      <div className="container py-16 max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Logowanie</CardTitle>
            <CardDescription>
              Zaloguj się do swojego konta N-GO
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Hasło</Label>
                  <Link 
                    to="/reset-hasla" 
                    className="text-sm text-ngo hover:underline"
                  >
                    Zapomniałeś hasła?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Zapamiętaj mnie
                </Label>
              </div>
              
              <Button type="submit" className="w-full btn-gradient" disabled={isLoading}>
                {isLoading ? 'Logowanie...' : 'Zaloguj się'}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Lub użyj konta demo
                  </span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleDemoLogin('organization')}
                  disabled={isLoading}
                >
                  Demo Organizacji
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleDemoLogin('sponsor')}
                  disabled={isLoading}
                >
                  Demo Sponsora
                </Button>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm">
              Nie masz jeszcze konta?{' '}
              <Link to="/rejestracja" className="text-ngo font-semibold hover:underline">
                Zarejestruj się
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
