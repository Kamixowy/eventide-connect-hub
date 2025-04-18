import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Clock, Building, User, MessageSquare } from 'lucide-react';
import { 
  getCollaborationById, 
  updateCollaborationStatus 
} from '@/services/collaborations';
import { 
  COLLABORATION_STATUS_NAMES, 
  COLLABORATION_STATUS_COLORS,
  CollaborationStatus,
  getAvailableActions
} from '@/services/collaborations/utils';

const CollaborationDetails = () => {
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
  
  const handleStatusChange = async (newStatus: CollaborationStatus) => {
    if (!id) return;
    
    try {
      await updateCollaborationStatus(id, newStatus);
      
      setCollaboration(prev => ({
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
            <div className="animate-spin w-8 h-8 border-t-2 border-blue-500 rounded-full"></div>
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
  
  const availableActions = getAvailableActions(collaboration.status, userType);
  const statusColor = COLLABORATION_STATUS_COLORS[collaboration.status] || 'gray';
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/wspolprace')}>
                <ArrowLeft size={16} className="mr-2" />
                Powrót
              </Button>
              <h1 className="text-2xl font-bold">{collaboration.event.title}</h1>
            </div>
            
            <Badge 
              className={`bg-${statusColor}-100 text-${statusColor}-700 border-${statusColor}-300 text-sm px-3 py-1`}
            >
              {COLLABORATION_STATUS_NAMES[collaboration.status] || 'Nieznany status'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card className="p-4">
                <h3 className="text-xl font-semibold mb-4">Informacje</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar size={20} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Data wydarzenia</p>
                      <p className="font-medium">{collaboration.event.date || 'Nie określono'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Utworzono</p>
                      <p className="font-medium">{collaboration.createdAt}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Ostatnia aktualizacja</p>
                      <p className="font-medium">{collaboration.lastUpdated}</p>
                    </div>
                  </div>
                  
                  {userType === 'organization' ? (
                    <div className="flex items-start gap-3">
                      <User size={20} className="text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Sponsor</p>
                        <p className="font-medium">{collaboration.sponsor.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <Building size={20} className="text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Organizacja</p>
                        <p className="font-medium">{collaboration.event.organization}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <MessageSquare size={20} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Wiadomość</p>
                      <p className="font-medium">{collaboration.message || 'Brak wiadomości'}</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-xl font-semibold mb-4">Akcje</h3>
                
                <div className="space-y-3">
                  {availableActions.includes('accept') && (
                    <Button 
                      className="w-full" 
                      variant="success"
                      onClick={() => handleStatusChange('accepted')}
                    >
                      Zaakceptuj
                    </Button>
                  )}
                  
                  {availableActions.includes('reject') && (
                    <Button 
                      className="w-full" 
                      variant="destructive"
                      onClick={() => handleStatusChange('rejected')}
                    >
                      Odrzuć
                    </Button>
                  )}
                  
                  {availableActions.includes('negotiate') && (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleStatusChange('negotiation')}
                    >
                      Negocjuj
                    </Button>
                  )}
                  
                  {availableActions.includes('complete') && (
                    <Button 
                      className="w-full" 
                      variant="success"
                      onClick={() => handleStatusChange('completed')}
                    >
                      Zakończ
                    </Button>
                  )}
                  
                  {availableActions.includes('cancel') && (
                    <Button 
                      className="w-full" 
                      variant="destructive"
                      onClick={() => handleStatusChange('canceled')}
                    >
                      Anuluj
                    </Button>
                  )}
                </div>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Szczegóły</TabsTrigger>
                    <TabsTrigger value="conversation">Konwersacja</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Opcje sponsoringu</h3>
                      
                      {collaboration.sponsorshipOptions.length > 0 ? (
                        <div className="space-y-4">
                          {collaboration.sponsorshipOptions.map((option: any, index: number) => (
                            <div 
                              key={index} 
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{option.title}</h4>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {option.description || 'Brak opisu'}
                                  </p>
                                </div>
                                <p className="font-bold text-lg">{option.amount} PLN</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Brak wybranych opcji sponsoringu
                        </p>
                      )}
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-xl font-semibold mb-2">Łączna kwota</h3>
                      <p className="text-3xl font-bold">{collaboration.totalAmount} PLN</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="conversation">
                    <div className="h-[400px] flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Moduł konwersacji zostanie zaimplementowany wkrótce
                      </p>
                    </div>
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

export default CollaborationDetails;
