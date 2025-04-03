
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EventFormValues, SponsorshipOption } from './EventEditSchema';

interface SponsorshipTabProps {
  methods: UseFormReturn<EventFormValues>;
  sponsorshipOptions: SponsorshipOption[];
  handleAddSponsorshipOption: (e?: React.MouseEvent) => void;
  handleRemoveSponsorshipOption: (id: string, e?: React.MouseEvent) => void;
  handleSponsorshipOptionChange: (id: string, field: keyof SponsorshipOption, value: string | string[]) => void;
  handleAddBenefit: (id: string, benefit: string, e?: React.MouseEvent) => void;
  handleRemoveBenefit: (id: string, benefit: string, e?: React.MouseEvent) => void;
  handleSponsorshipNumberChange: (e: React.ChangeEvent<HTMLInputElement>, id: string, field: 'priceFrom' | 'priceTo') => void;
}

const SponsorshipTab: React.FC<SponsorshipTabProps> = ({
  sponsorshipOptions,
  handleAddSponsorshipOption,
  handleRemoveSponsorshipOption,
  handleSponsorshipOptionChange,
  handleAddBenefit,
  handleRemoveBenefit,
  handleSponsorshipNumberChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Opcje sponsorowania</CardTitle>
        <CardDescription>
          Określ jakie formy sponsoringu oferujesz i jakie korzyści otrzymają sponsorzy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Use the existing SponsorshipSection component for editing */}
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
      </CardContent>
    </Card>
  );
};

// Import the SponsorshipSection component from the create form
import SponsorshipSection from '../create/sections/SponsorshipSection';

export default SponsorshipTab;
