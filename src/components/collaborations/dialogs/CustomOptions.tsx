
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MinusCircle } from 'lucide-react';
import { CollaborationOption } from '@/services/collaborations';

interface CustomOptionsProps {
  selectedOptions: CollaborationOption[];
  removeCustomOption: (index: number) => void;
  updateCustomOption: (index: number, field: keyof CollaborationOption, value: any) => void;
}

const CustomOptions: React.FC<CustomOptionsProps> = ({
  selectedOptions,
  removeCustomOption,
  updateCustomOption
}) => {
  const customOptions = selectedOptions.filter(o => o.is_custom);
  
  if (customOptions.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Własne opcje</h3>
      
      {customOptions.map((option, index) => {
        const optionIndex = selectedOptions.findIndex(o => 
          o.is_custom && o === option
        );
        
        return (
          <Card key={index} className="p-4 relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => removeCustomOption(optionIndex)}
            >
              <MinusCircle size={18} />
            </button>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor={`option-title-${index}`}>Nazwa</Label>
                <Input 
                  id={`option-title-${index}`}
                  value={option.title} 
                  onChange={(e) => updateCustomOption(optionIndex, 'title', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`option-desc-${index}`}>Opis</Label>
                <Textarea 
                  id={`option-desc-${index}`}
                  value={option.description || ''} 
                  onChange={(e) => updateCustomOption(optionIndex, 'description', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`option-amount-${index}`}>Kwota (PLN)</Label>
                <Input 
                  id={`option-amount-${index}`}
                  type="number" 
                  value={option.amount} 
                  onChange={(e) => updateCustomOption(optionIndex, 'amount', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CustomOptions;
