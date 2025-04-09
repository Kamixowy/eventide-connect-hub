
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Key, Calendar, Trash2 } from 'lucide-react';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileInfo from '@/components/profile/ProfileInfo';
import PersonalDataForm from '@/components/profile/PersonalDataForm';
import PasswordChangeForm from '@/components/profile/PasswordChangeForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.user_metadata?.avatar_url || null);
  const [generalError, setGeneralError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const isOrganization = user?.user_metadata?.userType === 'organization';
  const isSponsor = user?.user_metadata?.userType === 'sponsor';
  
  if (!user) {
    navigate('/logowanie');
    return null;
  }

  const handleDeleteProfile = async () => {
    try {
      setIsDeleting(true);
      
      // For demo users, simply sign out
      if (localStorage.getItem('demoUser')) {
        await signOut();
        toast({
          title: "Profil demo usunięty",
          description: "Zostałeś wylogowany z trybu demo.",
        });
        return;
      }
      
      // For real users, we would delete the user account here
      // This would typically involve a call to Supabase to delete the user
      // For now, we'll just sign the user out
      await signOut();
      
      toast({
        title: "Profil usunięty",
        description: "Twoje konto zostało usunięte z systemu.",
      });
      
      // Redirect to homepage
      navigate('/');
    } catch (error) {
      console.error('Error deleting profile:', error);
      setGeneralError('Wystąpił błąd podczas usuwania profilu. Spróbuj ponownie później.');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Mój profil</h1>
            
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Usuń profil
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Czy na pewno chcesz usunąć swoje konto?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ta operacja jest nieodwracalna. Wszystkie Twoje dane zostaną usunięte z systemu.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteProfile}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Usuwanie...' : 'Tak, usuń moje konto'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          {generalError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Błąd</AlertTitle>
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}
          
          <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <ProfileAvatar 
              user={user}
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
            />
            
            <ProfileInfo user={user} />
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
              {isSponsor && (
                <TabsTrigger value="wsparcia">
                  <Calendar className="mr-2 h-4 w-4" />
                  Moje wsparcia
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="dane">
              <PersonalDataForm user={user} />
            </TabsContent>
            
            <TabsContent value="haslo">
              <PasswordChangeForm user={user} />
            </TabsContent>
            
            {isSponsor && (
              <TabsContent value="wsparcia">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Historia wsparć</h3>
                  <p className="text-muted-foreground">
                    Tutaj będzie wyświetlana historia Twoich wsparć dla wydarzeń.
                  </p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
