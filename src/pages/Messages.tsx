
import Layout from "@/components/layout/Layout";
import MessagesContainer from "@/components/messages/MessagesContainer";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Messages = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Check authentication status
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Wymagane logowanie",
        description: "Musisz być zalogowany, aby przeglądać wiadomości",
        variant: "destructive"
      });
    }
  }, [user, isLoading, toast]);

  return (
    <Layout>
      <MessagesContainer />
    </Layout>
  );
};

export default Messages;
