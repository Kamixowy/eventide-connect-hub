
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PersonalDataFormProps {
  user: any;
}

const PersonalDataForm = ({ user }: PersonalDataFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [nameError, setNameError] = useState('');

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    
    if (!name.trim()) {
      setNameError('Imię i nazwisko nie może być puste');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: name.trim() }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Zaktualizowano dane',
        description: 'Twoje dane zostały zaktualizowane pomyślnie',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      toast({
        title: 'Błąd aktualizacji',
        description: 'Nie udało się zaktualizować danych. Spróbuj ponownie później.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleNameUpdate}>
        <CardHeader>
          <CardTitle>Dane osobowe</CardTitle>
          <CardDescription>
            Zaktualizuj swoje dane osobowe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Imię i nazwisko</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Wprowadź swoje imię i nazwisko"
            />
            {nameError && <p className="text-sm text-destructive mt-1">{nameError}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PersonalDataForm;
