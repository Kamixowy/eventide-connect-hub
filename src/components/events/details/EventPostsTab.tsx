
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventPostsList from '@/components/events/posts/EventPostsList';
import EventPostForm from '@/components/events/posts/EventPostForm';

interface EventPostsTabProps {
  showPostForm: boolean;
  isOwner: boolean;
  posts: any[];
  eventId: string;
  onPostFormShow: () => void;
  onPostFormHide: () => void;
  onPostSuccess: () => void;
  onPostDeleted: () => void;
}

const EventPostsTab: React.FC<EventPostsTabProps> = ({
  showPostForm,
  isOwner,
  posts,
  eventId,
  onPostFormShow,
  onPostFormHide,
  onPostSuccess,
  onPostDeleted
}) => {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Aktualności</h2>
        
        {isOwner && !showPostForm && (
          <Button onClick={onPostFormShow}>
            <Plus size={16} className="mr-2" /> Dodaj post
          </Button>
        )}
      </div>
      
      {isOwner && showPostForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dodaj nowy post</CardTitle>
          </CardHeader>
          <CardContent>
            <EventPostForm 
              eventId={eventId} 
              onSuccess={onPostSuccess} 
            />
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={onPostFormHide}
              >
                Anuluj
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <EventPostsList 
        posts={posts || []} 
        isOwner={isOwner}
        onPostDeleted={onPostDeleted}
      />
    </>
  );
};

export default EventPostsTab;
