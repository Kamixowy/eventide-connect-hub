
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { fetchOrganizations } from "@/services/messages";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import OrganizationSearchInput from "./OrganizationSearchInput";
import SelectedOrganization from "./SelectedOrganization";
import OrganizationsList from "./OrganizationsList";
import MessageInput from "./MessageInput";

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void;
  startNewConversation: (recipientId: string, initialMessage: string) => Promise<any>;
}

const NewMessageDialog = ({ 
  open, 
  onOpenChange, 
  onConversationCreated,
  startNewConversation
}: NewMessageDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
    enabled: open
  });

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSelectedOrganization(null);
      setMessage("");
      setError(null);
    }
  }, [open]);

  const filteredOrganizations = organizations.filter(org => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    const orgName = (org.name || "").toLowerCase();
    const orgOrgName = (org.organization?.name || "").toLowerCase();
    const userType = (org.user_type || "").toLowerCase();
    
    return orgName.includes(query) || 
           orgOrgName.includes(query) || 
           userType.includes(query);
  });

  const sortedOrganizations = [...filteredOrganizations].sort((a, b) => {
    const nameA = (a.organization?.name || a.name || "").toLowerCase();
    const nameB = (b.organization?.name || b.name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const handleStartConversation = async () => {
    if (!selectedOrganization) {
      toast({
        title: "Wybierz odbiorcę",
        description: "Musisz wybrać organizację, z którą chcesz rozpocząć rozmowę",
        variant: "destructive"
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Wiadomość jest pusta",
        description: "Musisz wpisać treść wiadomości",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Starting conversation with:", selectedOrganization.id);
      console.log("Initial message:", message);
      
      const result = await startNewConversation(selectedOrganization.id, message);
      
      if (result && result.conversationId) {
        toast({
          title: "Wiadomość wysłana",
          description: "Twoja wiadomość została wysłana pomyślnie",
        });
        
        console.log("Conversation created with ID:", result.conversationId);
        onConversationCreated(result.conversationId);
        onOpenChange(false);
        setMessage("");
        setSelectedOrganization(null);
        setSearchQuery("");
      } else {
        throw new Error("Nie udało się utworzyć konwersacji");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      let errorMessage = "Wystąpił błąd podczas wysyłania wiadomości";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast({
        title: "Błąd",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[80vh] flex flex-col"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle>Nowa wiadomość</DialogTitle>
          <DialogDescription id="dialog-description">
            Wybierz organizację i napisz wiadomość, aby rozpocząć nową konwersację
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="mb-4">
            <OrganizationSearchInput 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
          </div>
          
          {selectedOrganization ? (
            <SelectedOrganization 
              organization={selectedOrganization} 
              onChangeOrganization={() => setSelectedOrganization(null)} 
            />
          ) : (
            <OrganizationsList 
              organizations={organizations}
              filteredOrganizations={sortedOrganizations}
              isLoading={isLoading}
              onSelectOrganization={setSelectedOrganization}
            />
          )}
          
          <Separator className="my-4" />
          
          <MessageInput 
            message={message} 
            onChange={setMessage} 
          />
          
          {error && (
            <div className="mt-2 text-sm text-red-500">
              {error}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>
          <Button 
            className="btn-gradient" 
            onClick={handleStartConversation}
            disabled={isSubmitting || !selectedOrganization || !message.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Wysyłanie...
              </>
            ) : (
              "Wyślij wiadomość"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
