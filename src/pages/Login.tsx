
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Login form submitted with email:', email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error from form handler:', error);
        toast({
          title: "Błąd logowania",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Login successful, redirecting...');
        // Przekierowanie do strony głównej po zalogowaniu
        navigate('/');
      }
    } catch (err) {
      console.error('Unexpected error in login handler:', err);
      toast({
        title: "Wystąpił błąd",
        description: "Nie można połączyć się z serwerem. Spróbuj ponownie później.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
