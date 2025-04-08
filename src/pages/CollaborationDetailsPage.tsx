
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import CollaborationMessages from '@/components/collaborations/CollaborationMessages';
import CollaborationOptions from '@/components/collaborations/CollaborationOptions';
import CollaborationActions from '@/components/collaborations/CollaborationActions';
import CollaborationInfo from '@/components/collaborations/CollaborationInfo';
import { getCollaborationById, updateCollaborationStatus } from '@/services/collaborations';
import { COLLABORATION_STATUS_NAMES, COLLABORATION_STATUS_COLORS } from '@/services/collaborations/utils';

const CollaborationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [collaboration, setCollaboration] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [userType, setUserType] = useState<'organization' | 'sponsor'>('sponsor');
  
  useEffect(() => {
    const loadCollaboration = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getCollaborationById(id);
        
        setCollaboration(data);
        
        if (user?.user_metadata?.userType === 'organization') {
          setUserType('organization');
        } else {
          setUserType('sponsor');
        }
      } catch (error: any) {
        toast({
          title: "Błąd podczas ładowania współpracy",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCollaboration();
  }, [id, user, toast]);
  
  const handleStatusChange = async (newStatus: string) => {
    if (!collaboration?.id) return;
    
    try {
      await updateCollaborationStatus(collaboration.id, newStatus);
      
      setCollaboration((prev: any) => ({
        ...prev,
        status: newStatus
      }));
      
      toast({
        title: "Status zaktualizowany",
        description: `Status współpracy został zmieniony na: ${COLLABORATION_STATUS_NAMES[newStatus]}`,
      });
    } catch (error: any) {
      toast({
        title: "Błąd podczas aktualizacji statusu",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center justify-center h-60">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!collaboration) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Nie znaleziono współpracy</h2>
            <p className="text-muted-foreground mt-2">
              Współpraca o podanym ID nie istnieje lub nie masz do niej dostępu
            </p>
            <Button className="mt-4" onClick={() => navigate('/wspolprace')}>
              Wróć do listy współprac
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Get color for status badge
  const statusColor = COLLABORATION_STATUS_COLORS[collaboration.status] || 'gray';
  
  // Get event title
  const eventTitle = collaboration.events?.title || 
    (collaboration.event?.title ? collaboration.event.title : 'Bez tytułu');
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/wspolprace')}>
                ← Powrót
              </Button>
              <h1 className="text-2xl font-bold">{eventTitle}</h1>
            </div>
            
            <Badge 
              className={`bg-${statusColor}-100 text-${statusColor}-700 border-${statusColor}-300 text-sm px-3 py-1`}
            >
              {COLLABORATION_STATUS_NAMES[collaboration.status] || 'Nieznany status'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              {/* Informacje o współpracy */}
              <CollaborationInfo collaboration={collaboration} userType={userType} />
              
              {/* Działania na współpracy */}
              <CollaborationActions 
                collaboration={collaboration} 
                userType={userType}
                onStatusChange={handleStatusChange}
              />
            </div>
            
            <div className="md:col-span-2">
              <Card className="p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Szczegóły</TabsTrigger>
                    <TabsTrigger value="conversation">Konwersacja</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details">
                    <CollaborationOptions collaboration={collaboration} />
                  </TabsContent>
                  
                  <TabsContent value="conversation">
                    <CollaborationMessages
                      collaboration={collaboration}
                      userType={userType}
                    />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollaborationDetailsPage;
