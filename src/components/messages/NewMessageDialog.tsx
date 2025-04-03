
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { startConversation, fetchOrganizations } from "@/services/messages";
import { useQuery } from "@tanstack/react-query";

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

  // Fetch organizations
  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
    enabled: open
  });

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSelectedOrganization(null);
      setMessage("");
    }
  }, [open]);

  // Filter organizations based on search query
  const filteredOrganizations = organizations.filter(org => {
    const orgName = org.name?.toLowerCase() || "";
    const orgOrgName = org.organization?.name?.toLowerCase() || "";
    const orgCategory = org.organization?.category?.toLowerCase() || "";
    const query = searchQuery.toLowerCase().trim();
    
    return query === "" || 
      orgName.includes(query) || 
      orgOrgName.includes(query) || 
      orgCategory.includes(query);
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Nowa wiadomość</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Szukaj organizacji..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {selectedOrganization ? (
            <div className="p-3 border rounded-md mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={selectedOrganization.organization?.logo_url || selectedOrganization.avatar_url} 
                      alt={selectedOrganization.organization?.name || selectedOrganization.name} 
                    />
                    <AvatarFallback>
                      {(selectedOrganization.organization?.name || selectedOrganization.name)?.substring(0, 2) || 'OR'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedOrganization.organization?.name || selectedOrganization.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedOrganization.organization?.category || 'Organizacja'}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedOrganization(null)}
                >
                  Zmień
                </Button>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-grow border rounded-md h-[200px] mb-4">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Ładowanie organizacji...
                </div>
              ) : filteredOrganizations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Nie znaleziono organizacji spełniających kryteria wyszukiwania
                </div>
              ) : (
                <div className="divide-y">
                  {filteredOrganizations.map((org) => (
                    <div
                      key={org.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedOrganization(org)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage 
                            src={org.organization?.logo_url || org.avatar_url} 
                            alt={org.organization?.name || org.name} 
                          />
                          <AvatarFallback>
                            {(org.organization?.name || org.name)?.substring(0, 2) || 'OR'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">
                            {org.organization?.name || org.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {org.email}
                          </p>
                          <div className="mt-1">
                            {org.organization?.category && (
                              <Badge 
                                variant="outline"
                                className="text-xs px-1.5 py-0 bg-blue-50 text-blue-700 hover:bg-blue-50"
                              >
                                {org.organization.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}
          
          <Separator className="my-4" />
          
          <div className="mb-4">
            <Textarea
              placeholder="Napisz wiadomość..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
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
