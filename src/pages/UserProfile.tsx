
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Key } from 'lucide-react';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileInfo from '@/components/profile/ProfileInfo';
import PersonalDataForm from '@/components/profile/PersonalDataForm';
import PasswordChangeForm from '@/components/profile/PasswordChangeForm';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.user_metadata?.avatar_url || null);
  const [generalError, setGeneralError] = useState('');
  
  if (!user) {
    navigate('/logowanie');
    return null;
  }

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
            </TabsList>
            
            <TabsContent value="dane">
              <PersonalDataForm user={user} />
            </TabsContent>
            
            <TabsContent value="haslo">
              <PasswordChangeForm user={user} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
