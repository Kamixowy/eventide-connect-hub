
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, X, Check } from 'lucide-react';
import { SponsorshipOption } from '../EventCreateSchema';

interface SponsorshipSectionProps {
  sponsorshipOptions: SponsorshipOption[];
  handleAddSponsorshipOption: (e?: React.MouseEvent) => void;
  handleRemoveSponsorshipOption: (id: string, e?: React.MouseEvent) => void;
  handleSponsorshipOptionChange: (id: string, field: keyof SponsorshipOption, value: string | string[]) => void;
  handleAddBenefit: (id: string, benefit: string, e?: React.MouseEvent) => void;
  handleRemoveBenefit: (id: string, benefit: string, e?: React.MouseEvent) => void;
  handleSponsorshipNumberChange: (e: React.ChangeEvent<HTMLInputElement>, id: string, field: 'priceFrom' | 'priceTo') => void;
}

const SponsorshipSection = ({
  sponsorshipOptions,
  handleAddSponsorshipOption,
  handleRemoveSponsorshipOption,
  handleSponsorshipOptionChange,
  handleAddBenefit,
  handleRemoveBenefit,
  handleSponsorshipNumberChange,
}: SponsorshipSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Opcje sponsorowania</CardTitle>
        <CardDescription>
          Określ jakie formy sponsoringu oferujesz i jakie korzyści otrzymają sponsorzy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sponsorshipOptions.map((option, index) => (
          <div key={option.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Opcja sponsoringu {index + 1}</h3>
              {sponsorshipOptions.length > 1 && (
                <Button 
                  type="button" 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  onClick={(e) => handleRemoveSponsorshipOption(option.id, e)}
                >
                  <Trash2 size={16} className="mr-2" /> Usuń
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`option-title-${option.id}`}>Nazwa opcji</Label>
              <Input 
                id={`option-title-${option.id}`} 
                placeholder="Np. Partner Główny" 
                value={option.title}
                onChange={(e) => handleSponsorshipOptionChange(option.id, 'title', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`option-desc-${option.id}`}>Opis</Label>
              <Textarea 
                id={`option-desc-${option.id}`} 
                placeholder="Opisz na czym polega ta opcja sponsoringu" 
                value={option.description}
                onChange={(e) => handleSponsorshipOptionChange(option.id, 'description', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`option-price-from-${option.id}`}>Cena od (PLN)</Label>
                <Input 
                  id={`option-price-from-${option.id}`} 
                  placeholder="Np. 1000" 
                  value={option.priceFrom}
                  onChange={(e) => handleSponsorshipNumberChange(e, option.id, 'priceFrom')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`option-price-to-${option.id}`}>Cena do (PLN)</Label>
                <Input 
                  id={`option-price-to-${option.id}`} 
                  placeholder="Np. 5000" 
                  value={option.priceTo}
                  onChange={(e) => handleSponsorshipNumberChange(e, option.id, 'priceTo')}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Korzyści dla sponsora</Label>
              <div className="space-y-2">
                {option.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center">
                    <Check size={16} className="mr-2 text-green-500" />
                    <span className="flex-grow">{benefit}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground"
                      onClick={(e) => handleRemoveBenefit(option.id, benefit, e)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2 mt-2">
                <Input 
                  placeholder="Np. Logo na koszulkach" 
                  id={`new-benefit-${option.id}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = document.getElementById(`new-benefit-${option.id}`) as HTMLInputElement;
                      if (input.value) {
                        handleAddBenefit(option.id, input.value);
                        input.value = '';
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = document.getElementById(`new-benefit-${option.id}`) as HTMLInputElement;
                    if (input.value) {
                      handleAddBenefit(option.id, input.value, e);
                      input.value = '';
                    }
                  }}
                >
                  <Plus size={16} className="mr-2" /> Dodaj
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleAddSponsorshipOption}
        >
          <Plus size={16} className="mr-2" /> Dodaj kolejną opcję sponsorowania
        </Button>
      </CardContent>
    </Card>
  );
};

export default SponsorshipSection;
