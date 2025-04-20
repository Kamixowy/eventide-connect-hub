
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import CollaborationOptions from '@/components/collaborations/CollaborationOptions';
import CollaborationActions from '@/components/collaborations/CollaborationActions';
import CollaborationInfo from '@/components/collaborations/CollaborationInfo';
import { 
  getCollaborationById, 
  updateCollaborationStatus, 
  uploadSettlementFile,
  updateCollaborationOptions 
} from '@/services/collaborations';
import { 
  COLLABORATION_STATUS_NAMES, 
  COLLABORATION_STATUS_COLORS, 
  CollaborationStatus 
} from '@/services/collaborations/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CollaborationOptionsEdit from '@/components/collaborations/dialog/CollaborationOptionsEdit';

const CollaborationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [collaboration, setCollaboration] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<'organization' | 'sponsor'>('sponsor');
  const [activeTab, setActiveTab] = useState('details');
  const [isEditingOptions, setIsEditingOptions] = useState(false);
  
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
  
  useEffect(() => {
    loadCollaboration();
  }, [id, user, toast]);
  
  const handleStatusChange = async (newStatus: CollaborationStatus, settlementFile?: File) => {
    if (!collaboration?.id) return;
    
    try {
      if (newStatus === 'settlement' && settlementFile) {
        // Upload settlement file and update status
        await uploadSettlementFile(collaboration.id, settlementFile);
        toast({
          title: "Rozliczenie przesłane",
          description: "Plik rozliczenia został przesłany do sponsora."
        });
      } else {
        // Just update the status
        await updateCollaborationStatus(collaboration.id, newStatus);
        toast({
          title: "Status zaktualizowany",
          description: `Status współpracy został zmieniony na: ${COLLABORATION_STATUS_NAMES[newStatus]}`,
        });
      }
      
      // Reload collaboration data
      loadCollaboration();
    } catch (error: any) {
      toast({
        title: "Błąd podczas aktualizacji statusu",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleEditOptions = () => {
    setIsEditingOptions(true);
  };
  
  const handleSaveOptions = async () => {
    await loadCollaboration();
    setIsEditingOptions(false);
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
                onEditOptions={handleEditOptions}
              />
            </div>
            
            <div className="md:col-span-2">
              <Card className="p-4">
                {isEditingOptions ? (
                  <CollaborationOptionsEdit
                    collaboration={collaboration}
                    onSave={handleSaveOptions}
                    onCancel={() => setIsEditingOptions(false)}
                  />
                ) : (
                  <CollaborationOptions collaboration={collaboration} />
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollaborationDetailsPage;
