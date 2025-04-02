
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Calendar, Info, Tag } from 'lucide-react';
import { EventFormValues } from './EventEditSchema';
import BasicInfoTab from './BasicInfoTab';
import DetailsTab from './DetailsTab';
import MediaTab from './MediaTab';

interface EventEditFormProps {
  methods: UseFormReturn<EventFormValues>;
  onSubmit: (data: EventFormValues) => Promise<void>;
  submitting: boolean;
  uploadedImageUrl: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const EventEditForm = ({
  methods,
  onSubmit,
  submitting,
  uploadedImageUrl,
  handleImageUpload,
}: EventEditFormProps) => {
  return (
    <Form>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">
              <Info className="mr-2 h-4 w-4" />
              Podstawowe informacje
            </TabsTrigger>
            <TabsTrigger value="details">
              <Tag className="mr-2 h-4 w-4" />
              Szczegóły
            </TabsTrigger>
            <TabsTrigger value="media">
              <Calendar className="mr-2 h-4 w-4" />
              Media i dodatkowe
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <BasicInfoTab methods={methods} />
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            <DetailsTab methods={methods} />
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6">
            <MediaTab 
              methods={methods}
              uploadedImageUrl={uploadedImageUrl} 
              handleImageUpload={handleImageUpload} 
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={submitting}
            variant="success"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Zapisywanie...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Zapisz zmiany
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventEditForm;
