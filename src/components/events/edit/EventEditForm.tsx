
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Calendar, Info, Tag, HandCoins, Trash2 } from 'lucide-react';
import { EventFormValues, SponsorshipOption } from './EventEditSchema';
import BasicInfoTab from './BasicInfoTab';
import DetailsTab from './DetailsTab';
import MediaTab from './MediaTab';
import SponsorshipTab from './SponsorshipTab';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Define status options for event status selection
const statusOptions = [
  "Planowane",
  "W przygotowaniu",
  "W trakcie",
  "Zakończone",
  "Odwołane"
];

interface EventEditFormProps {
  methods: UseFormReturn<EventFormValues>;
  onSubmit: (data: EventFormValues) => Promise<void>;
  submitting: boolean;
  uploadedImageUrl: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  sponsorshipOptions: SponsorshipOption[];
  handleAddSponsorshipOption: (e?: React.MouseEvent) => void;
  handleRemoveSponsorshipOption: (id: string, e?: React.MouseEvent) => void;
  handleSponsorshipOptionChange: (id: string, field: keyof SponsorshipOption, value: string | string[]) => void;
  handleAddBenefit: (id: string, benefit: string, e?: React.MouseEvent) => void;
  handleRemoveBenefit: (id: string, benefit: string, e?: React.MouseEvent) => void;
  handleSponsorshipNumberChange: (e: React.ChangeEvent<HTMLInputElement>, id: string, field: 'priceFrom' | 'priceTo') => void;
  onDelete: () => Promise<void>;
  deleting: boolean;
}

const EventEditForm = ({
  methods,
  onSubmit,
  submitting,
  uploadedImageUrl,
  handleImageUpload,
  sponsorshipOptions,
  handleAddSponsorshipOption,
  handleRemoveSponsorshipOption,
  handleSponsorshipOptionChange,
  handleAddBenefit,
  handleRemoveBenefit,
  handleSponsorshipNumberChange,
  onDelete,
  deleting,
}: EventEditFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleDelete = async () => {
    await onDelete();
    setDialogOpen(false);
  };

  return (
    <Form {...methods}>
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
            <TabsTrigger value="sponsorship">
              <HandCoins className="mr-2 h-4 w-4" />
              Formy współpracy
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

          <TabsContent value="sponsorship" className="space-y-6">
            <SponsorshipTab 
              methods={methods}
              sponsorshipOptions={sponsorshipOptions}
              handleAddSponsorshipOption={handleAddSponsorshipOption}
              handleRemoveSponsorshipOption={handleRemoveSponsorshipOption}
              handleSponsorshipOptionChange={handleSponsorshipOptionChange}
              handleAddBenefit={handleAddBenefit}
              handleRemoveBenefit={handleRemoveBenefit}
              handleSponsorshipNumberChange={handleSponsorshipNumberChange}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between">
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                type="button"
                variant="destructive"
                className="w-full md:w-auto"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Usuwanie...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Usuń wydarzenie
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Czy na pewno chcesz usunąć to wydarzenie?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ta operacja jest nieodwracalna. Wydarzenie zostanie całkowicie usunięte
                  z systemu wraz ze wszystkimi powiązanymi informacjami.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Usuń
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
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
