
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PasswordChangeFormProps {
  user: any;
}

const PasswordChangeForm = ({ user }: PasswordChangeFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (!currentPassword) {
      setPasswordError('Wprowadź aktualne hasło');
      return;
    }
    
    if (!newPassword) {
      setPasswordError('Wprowadź nowe hasło');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Nowe hasło i potwierdzenie hasła nie są zgodne');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Nowe hasło musi zawierać co najmniej 6 znaków');
      return;
    }
    
    setLoading(true);
    
    try {
      if (localStorage.getItem('demoUser')) {
        toast({
          title: 'Tryb demo',
          description: 'W trybie demo nie można zmienić hasła',
          variant: 'default',
        });
        setLoading(false);
        return;
      }
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: 'Hasło zostało zmienione',
        description: 'Twoje hasło zostało zmienione pomyślnie',
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      setPasswordError(error.message || 'Wystąpił błąd podczas zmiany hasła');
      
      toast({
        title: 'Błąd zmiany hasła',
        description: 'Nie udało się zmienić hasła. Sprawdź, czy aktualne hasło jest poprawne.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handlePasswordUpdate}>
        <CardHeader>
          <CardTitle>Zmiana hasła</CardTitle>
          <CardDescription>
            Aktualizuj swoje hasło
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Aktualne hasło</Label>
            <Input 
              id="current-password" 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Wprowadź aktualne hasło"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nowe hasło</Label>
            <Input 
              id="new-password" 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Wprowadź nowe hasło"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Potwierdź nowe hasło</Label>
            <Input 
              id="confirm-password" 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Wprowadź ponownie nowe hasło" 
            />
          </div>
          {passwordError && (
            <div className="text-sm text-destructive mt-2">{passwordError}</div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? 'Aktualizowanie...' : 'Zmień hasło'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PasswordChangeForm;
