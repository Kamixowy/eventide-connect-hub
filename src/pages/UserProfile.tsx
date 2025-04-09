
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { User, UserCircle, Key, Upload } from 'lucide-react';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.user_metadata?.avatar_url || null);
  
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  if (!user) {
    navigate('/logowanie');
    return null;
  }

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setGeneralError('');
    
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
      setGeneralError(error.message || 'Wystąpił błąd podczas aktualizacji danych');
      
      toast({
        title: 'Błąd aktualizacji',
        description: 'Nie udało się zaktualizować danych. Spróbuj ponownie później.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setGeneralError('');
    
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
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Nieprawidłowy format pliku',
        description: 'Proszę wybrać plik graficzny (JPG, PNG, GIF)',
        variant: 'destructive',
      });
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Plik jest za duży',
        description: 'Maksymalny rozmiar pliku to 2MB',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (localStorage.getItem('demoUser')) {
        const tempUrl = URL.createObjectURL(file);
        setAvatarUrl(tempUrl);
        
        toast({
          title: 'Tryb demo',
          description: 'W trybie demo avatar zostanie zmieniony tylko tymczasowo',
          variant: 'default',
        });
        setLoading(false);
        return;
      }
      
      // Implement real avatar upload to Supabase Storage
      const fileName = `avatar-${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
      
      // Check if 'avatars' bucket exists, if not create one (normally this should be done on backend setup)
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucket = buckets?.find(bucket => bucket.name === 'avatars');
      
      if (!avatarBucket) {
        // Create avatars bucket if it doesn't exist
        const { error: bucketError } = await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 2 * 1024 * 1024, // 2MB
        });
        
        if (bucketError) {
          console.error('Error creating bucket:', bucketError);
          throw new Error('Nie można utworzyć miejsca na avatary');
        }
      }
      
      // Upload the file to storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type 
        });
        
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      setAvatarUrl(publicUrl);
        
      // Update user metadata with the new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      
      if (updateError) {
        console.error('Error updating user metadata:', updateError);
        throw updateError;
      }
      
      toast({
        title: 'Avatar zaktualizowany',
        description: 'Twój avatar został pomyślnie zaktualizowany',
      });
      
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Błąd przesyłania',
        description: 'Nie udało się przesłać avatara. Spróbuj ponownie później.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Mój profil</h1>
          
          {generalError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Błąd</AlertTitle>
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}
          
          <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={avatarUrl || user.user_metadata?.avatar_url} alt={user.user_metadata?.name || 'User'} />
                <AvatarFallback className="text-4xl">
                  {user.user_metadata?.name?.substring(0, 2) || user.email?.substring(0, 2) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-2 rounded-md text-sm transition-colors">
                  <Upload size={16} />
                  <span>Zmień avatar</span>
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={loading}
                />
              </label>
            </div>
            
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>Informacje o profilu</CardTitle>
                  <CardDescription>
                    Twój adres email: {user.email}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Typ konta: {user.user_metadata?.userType === 'organization' ? 'Organizacja' : 'Sponsor'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Tabs defaultValue="dane">
            <TabsList className="mb-6">
              <TabsTrigger value="dane">
                <User className="mr-2 h-4 w-4" />
                Dane osobowe
              </TabsTrigger>
              <TabsTrigger value="haslo">
                <Key className="mr-2 h-4 w-4" />
                Zmiana hasła
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dane">
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
            </TabsContent>
            
            <TabsContent value="haslo">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
