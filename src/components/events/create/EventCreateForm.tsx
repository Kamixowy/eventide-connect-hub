
import React, { useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { EventCreateValues, SponsorshipOption } from './EventCreateSchema';
import BasicInfoSection from './sections/BasicInfoSection';
import DateLocationSection from './sections/DateLocationSection';
import DetailsSection from './sections/DetailsSection';
import SocialMediaSection from './sections/SocialMediaSection';
import SponsorshipSection from './sections/SponsorshipSection';
import ImageUploadSection from './sections/ImageUploadSection';

interface EventCreateFormProps {
  methods: UseFormReturn<EventCreateValues>;
  onSubmit: (data: EventCreateValues) => Promise<void>;
  isSubmitting: boolean;
  bannerImage: File | null;
  bannerPreview: string | null;
  handleBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetBannerImage: () => void;
  sponsorshipOptions: SponsorshipOption[];
  handleAddSponsorshipOption: (e?: React.MouseEvent) => void;
  handleRemoveSponsorshipOption: (id: string, e?: React.MouseEvent) => void;
  handleSponsorshipOptionChange: (id: string, field: keyof SponsorshipOption, value: string | string[]) => void;
  handleAddBenefit: (id: string, benefit: string, e?: React.MouseEvent) => void;
  handleRemoveBenefit: (id: string, benefit: string, e?: React.MouseEvent) => void;
  handleSponsorshipNumberChange: (e: React.ChangeEvent<HTMLInputElement>, id: string, field: 'priceFrom' | 'priceTo') => void;
}

const EventCreateForm = ({
  methods,
  onSubmit,
  isSubmitting,
  bannerImage,
  bannerPreview,
  handleBannerUpload,
  resetBannerImage,
  sponsorshipOptions,
  handleAddSponsorshipOption,
  handleRemoveSponsorshipOption,
  handleSponsorshipOptionChange,
  handleAddBenefit,
  handleRemoveBenefit,
  handleSponsorshipNumberChange,
}: EventCreateFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Form>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <BasicInfoSection methods={methods} />
            <DateLocationSection methods={methods} />
            <DetailsSection methods={methods} />
            <SocialMediaSection methods={methods} />
            <SponsorshipSection 
              sponsorshipOptions={sponsorshipOptions}
              handleAddSponsorshipOption={handleAddSponsorshipOption}
              handleRemoveSponsorshipOption={handleRemoveSponsorshipOption}
              handleSponsorshipOptionChange={handleSponsorshipOptionChange}
              handleAddBenefit={handleAddBenefit}
              handleRemoveBenefit={handleRemoveBenefit}
              handleSponsorshipNumberChange={handleSponsorshipNumberChange}
            />
          </div>
          
          <div className="md:col-span-1 space-y-6">
            <div className="sticky top-6">
              <ImageUploadSection
                bannerPreview={bannerPreview}
                resetBannerImage={resetBannerImage}
                fileInputRef={fileInputRef}
                handleBannerUpload={handleBannerUpload}
              />
              
              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full btn-gradient"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Dodawanie...' : 'Dodaj wydarzenie'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default EventCreateForm;
