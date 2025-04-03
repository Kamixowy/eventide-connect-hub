import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { startConversation, fetchOrganizations } from "@/services/messages";
import { useQuery } from "@tanstack/react-query";

import OrganizationSearchInput from "./OrganizationSearchInput";
import SelectedOrganization from "./SelectedOrganization";
import OrganizationsList from "./OrganizationsList";
import MessageInput from "./MessageInput";

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void;
}

const NewMessageDialog = ({ open, onOpenChange, onConversationCreated }: NewMessageDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    }
  }, [open]);

  const filteredOrganizations = organizations.filter(org => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    const orgName = (org.name || "").toLowerCase();
    const orgOrgName = (org.organization?.name || "").toLowerCase();
    const orgCategory = (org.organization?.category || "").toLowerCase();
    const orgEmail = (org.email || "").toLowerCase();
    
    return orgName.includes(query) || 
           orgOrgName.includes(query) || 
           orgCategory.includes(query) ||
           orgEmail.includes(query);
  });

  const sortedOrganizations = [...filteredOrganizations].sort((a, b) => {
    const nameA = (a.organization?.name || a.name || "").toLowerCase();
    const nameB = (b.organization?.name || b.name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  console.log("Search query:", searchQuery);
  console.log("Filtered organizations:", filteredOrganizations);
  console.log("All organizations:", organizations);

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

    try {
      const result = await startConversation(selectedOrganization.id, message);
      
      if (result) {
        toast({
          title: "Wiadomość wysłana",
          description: "Twoja wiadomość została wysłana pomyślnie",
        });
        
        onConversationCreated(result.conversationId);
        onOpenChange(false);
        setMessage("");
        setSelectedOrganization(null);
        setSearchQuery("");
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się wysłać wiadomości. Spróbuj ponownie.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas wysyłania wiadomości",
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
          <DialogDescription id="dialog-description" className="sr-only">
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
            {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
