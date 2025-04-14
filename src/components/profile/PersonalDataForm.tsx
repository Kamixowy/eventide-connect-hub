
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
  const [companyName, setCompanyName] = useState(user?.user_metadata?.companyName || '');
  const [companyError, setCompanyError] = useState('');
  
  const isSponsor = user?.user_metadata?.userType === 'sponsor';

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setCompanyError('');
    
    if (!name.trim()) {
      setNameError('Imię i nazwisko nie może być puste');
      return;
    }
    
    if (isSponsor && !companyName.trim()) {
      setCompanyError('Nazwa firmy nie może być pusta');
      return;
    }
    
    setLoading(true);
    
    try {
      const metadata: Record<string, any> = { name: name.trim() };
      
      // Add company name to metadata for sponsors
      if (isSponsor) {
        metadata.companyName = companyName.trim();
      }
      
      const { error } = await supabase.auth.updateUser({
        data: metadata
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
      <form onSubmit={handleUpdate}>
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
          
          {isSponsor && (
            <div className="space-y-2">
              <Label htmlFor="companyName">Nazwa firmy</Label>
              <Input 
                id="companyName" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
                placeholder="Wprowadź nazwę swojej firmy"
              />
              {companyError && <p className="text-sm text-destructive mt-1">{companyError}</p>}
            </div>
          )}
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
