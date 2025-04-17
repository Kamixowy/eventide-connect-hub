
import React from 'react';
import { Check } from 'lucide-react';

interface SponsorshipOptionProps {
  option: {
    title: string;
    description: string;
    price: {
      from: number | string;
      to: number | string;
    };
    benefits: string[];
  };
}

const SponsorshipOption: React.FC<SponsorshipOptionProps> = ({ option }) => {
  return (
    <div className="border rounded-md p-4 space-y-3">
      <h4 className="font-semibold">{option.title}</h4>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{option.description}</span>
        <span className="font-medium">
          {option.price.from}{option.price.from !== option.price.to && ` - ${option.price.to}`} PLN
        </span>
      </div>
      
      {option.benefits && option.benefits.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Korzyści:</p>
          <ul className="text-sm space-y-1">
            {option.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SponsorshipOption;
