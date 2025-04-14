
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface AccountTypeSelectorProps {
  accountType: 'organization' | 'sponsor';
  onChange: (value: 'organization' | 'sponsor') => void;
}

const AccountTypeSelector = ({ accountType, onChange }: AccountTypeSelectorProps) => {
  return (
    <RadioGroup 
      value={accountType} 
      onValueChange={(value) => onChange(value as 'organization' | 'sponsor')}
      className="grid grid-cols-2 gap-4 mb-6"
    >
      <div>
        <RadioGroupItem 
          value="organization" 
          id="organization" 
          className="peer sr-only" 
        />
        <Label
          htmlFor="organization"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-ngo [&:has([data-state=checked])]:border-ngo"
        >
          <span className="text-center font-medium">Organizacja</span>
        </Label>
      </div>
      <div>
        <RadioGroupItem 
          value="sponsor" 
          id="sponsor" 
          className="peer sr-only" 
        />
        <Label
          htmlFor="sponsor"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-ngo [&:has([data-state=checked])]:border-ngo"
        >
          <span className="text-center font-medium">Sponsor</span>
        </Label>
      </div>
    </RadioGroup>
  );
};

export default AccountTypeSelector;
