
import React from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Clock, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { deleteEventPost } from '@/services/eventService';

interface EventPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface EventPostsListProps {
  posts: EventPost[];
  isOwner: boolean;
  onPostDeleted: () => void;
}

const EventPostsList: React.FC<EventPostsListProps> = ({ posts, isOwner, onPostDeleted }) => {
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'd MMMM yyyy, HH:mm', { locale: pl });
  };
  
  const handleDelete = async (postId: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten post?')) {
      try {
        await deleteEventPost(postId);
        toast({
          title: "Post usunięty",
          description: "Post został pomyślnie usunięty."
        });
        onPostDeleted();
      } catch (error) {
        console.error("Error deleting post:", error);
        toast({
          title: "Błąd",
          description: "Nie udało się usunąć postu. Spróbuj ponownie.",
          variant: "destructive"
        });
      }
    }
  };
  
  if (posts.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Nie dodano jeszcze żadnych postów dla tego wydarzenia.
      </p>
    );
  }
  
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{post.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock size={14} className="mr-1" />
                {formatDate(post.created_at)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none mb-4">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {isOwner && (
              <div className="flex justify-end mt-4 gap-2">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 size={16} className="mr-1" /> Usuń
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventPostsList;
