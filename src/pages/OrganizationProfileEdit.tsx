
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import OrganizationBasicInfoForm from '@/components/organizations/profile/edit/OrganizationBasicInfoForm';
import OrganizationContactForm from '@/components/organizations/profile/edit/OrganizationContactForm';
import OrganizationMediaForm from '@/components/organizations/profile/edit/OrganizationMediaForm';

const OrganizationProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jeśli użytkownik nie jest zalogowany lub nie jest organizacją, przekieruj na stronę logowania
    if (!user) {
      navigate('/logowanie');
      return;
    }

    if (user.user_metadata?.userType !== 'organization') {
      toast({
        variant: "destructive",
        title: "Brak dostępu",
        description: "Ta strona jest dostępna tylko dla organizacji."
      });
      navigate('/');
      return;
    }

    setLoading(false);
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-12">
          <p className="text-center text-muted-foreground">Ładowanie...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Edytuj profil organizacji</h1>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Podstawowe informacje</TabsTrigger>
            <TabsTrigger value="contact">Kontakt</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Podstawowe informacje</CardTitle>
                <CardDescription>
                  Edytuj podstawowe informacje o swojej organizacji
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrganizationBasicInfoForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informacje kontaktowe</CardTitle>
                <CardDescription>
                  Zaktualizuj dane kontaktowe Twojej organizacji
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrganizationContactForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Media i zdjęcia</CardTitle>
                <CardDescription>
                  Zmień logo, zdjęcie w tle i dodaj linki do social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrganizationMediaForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OrganizationProfileEdit;
