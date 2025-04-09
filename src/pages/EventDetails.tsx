
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { useEventDetails } from '@/hooks/useEventDetails';
import EventHeader from '@/components/events/details/EventHeader';
import EventBasicInfo from '@/components/events/details/EventBasicInfo';
import EventDetailsTab from '@/components/events/details/EventDetailsTab';
import EventPostsTab from '@/components/events/details/EventPostsTab';
import EventSidebar from '@/components/events/details/EventSidebar';
import LoadingState from '@/components/common/LoadingState';
import { Button } from '@/components/ui/button';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const {
    event,
    loading,
    isOwner,
    statusUpdating,
    showPostForm,
    statusOptions,
    setShowPostForm,
    handleStatusChange,
    handlePostSuccess,
    fetchEventDetails,
    handleCopyLink,
    handleContactOrganization
  } = useEventDetails(id);
  
  const userType = user?.user_metadata?.userType || null;
  const isLoggedIn = !!user;

  if (loading) {
    return (
      <Layout>
        <LoadingState message="Ładowanie szczegółów wydarzenia..." />
      </Layout>
    );
  }
  
  if (!event) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Nie znaleziono wydarzenia</h2>
          <Button onClick={() => navigate('/wydarzenia')}>
            Wróć do listy wydarzeń
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <EventHeader 
        title={event.title}
        status={event.status}
        banner={event.banner}
        isOwner={isOwner}
        eventId={id || ''}
        onStatusChange={handleStatusChange}
        statusOptions={statusOptions}
        statusUpdating={statusUpdating}
      />

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventBasicInfo 
              organization={event.organization}
              date={event.date}
              startDate={event.start_date}
              endDate={event.end_date}
              location={event.location}
              attendees={event.attendees}
            />

            <Tabs defaultValue="details" className="mb-8">
              <TabsList className="w-full bg-transparent border-b rounded-none h-auto p-0 mb-6">
                <TabsTrigger 
                  value="details" 
                  className="rounded-none border-b-2 data-[state=active]:border-ngo data-[state=active]:text-foreground px-4 py-2"
                >
                  Szczegóły
                </TabsTrigger>
                <TabsTrigger 
                  value="posts" 
                  className="rounded-none border-b-2 data-[state=active]:border-ngo data-[state=active]:text-foreground px-4 py-2"
                >
                  Aktualności
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-0">
                <EventDetailsTab 
                  description={event.description}
                  audience={event.audience}
                  category={event.category}
                  tags={event.tags}
                  socialMedia={event.socialMedia}
                />
              </TabsContent>
              
              <TabsContent value="posts" className="mt-0">
                <EventPostsTab 
                  showPostForm={showPostForm}
                  isOwner={isOwner}
                  posts={event.posts}
                  eventId={id || ''}
                  onPostFormShow={() => setShowPostForm(true)}
                  onPostFormHide={() => setShowPostForm(false)}
                  onPostSuccess={handlePostSuccess}
                  onPostDeleted={fetchEventDetails}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <EventSidebar 
              sponsorshipOptions={event.sponsorshipOptions}
              isLoggedIn={isLoggedIn}
              userType={userType}
              onContactOrganization={handleContactOrganization}
              onCopyLink={handleCopyLink}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;
