
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EventFormValues, SponsorshipOption } from './EventEditSchema';
import { Button } from '@/components/ui/button';
import { HandCoins, Plus, Trash, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  // Add some debugging to check sponsorship options
  console.log('SponsorshipTab render - Current options:', sponsorshipOptions);
  
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
          {sponsorshipOptions.length > 0 ? (
            sponsorshipOptions.map((option) => (
              <div 
                key={option.id} 
                className="border rounded-lg p-4 space-y-4 relative"
              >
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={(e) => handleRemoveSponsorshipOption(option.id, e)}
                  type="button"
                >
                  <Trash className="h-4 w-4" />
                </Button>
                
                <div>
                  <label className="text-sm font-medium">Nazwa pakietu</label>
                  <Input
                    value={option.title}
                    onChange={(e) => handleSponsorshipOptionChange(option.id, 'title', e.target.value)}
                    placeholder="np. Pakiet Złoty"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Opis pakietu</label>
                  <Textarea
                    value={option.description}
                    onChange={(e) => handleSponsorshipOptionChange(option.id, 'description', e.target.value)}
                    placeholder="Opisz czego dotyczy ten pakiet sponsorski"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Cena od (zł)</label>
                    <Input
                      value={option.priceFrom}
                      onChange={(e) => handleSponsorshipNumberChange(e, option.id, 'priceFrom')}
                      placeholder="0"
                      className="mt-1"
                      type="number"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cena do (zł)</label>
                    <Input
                      value={option.priceTo}
                      onChange={(e) => handleSponsorshipNumberChange(e, option.id, 'priceTo')}
                      placeholder="0"
                      className="mt-1"
                      type="number"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <label className="text-sm font-medium mr-2">Korzyści</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">
                            Korzyści będą widoczne po najechaniu kursorem na pakiet sponsorski na stronie wydarzenia
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {option.benefits.map((benefit, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {benefit}
                        <button
                          type="button"
                          onClick={(e) => handleRemoveBenefit(option.id, benefit, e)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none ml-1"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-2 flex">
                    <Input
                      id={`benefit-${option.id}`}
                      placeholder="Dodaj korzyść i naciśnij Enter"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (input.value.trim()) {
                            handleAddBenefit(option.id, input.value.trim(), e as any);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-2"
                      onClick={(e) => {
                        const input = document.getElementById(`benefit-${option.id}`) as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleAddBenefit(option.id, input.value.trim(), e);
                          input.value = '';
                        } else {
                          toast({
                            title: "Błąd",
                            description: "Pole korzyści nie może być puste",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      Dodaj
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-4" />
              </div>
            ))
          ) : (
            <div className="text-center p-6 border border-dashed rounded-lg">
              <HandCoins className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Brak opcji sponsorowania</h3>
              <p className="text-muted-foreground mb-4">
                Dodaj opcje sponsorowania, aby potencjalni partnerzy mogli łatwiej zdecydować o współpracy
              </p>
            </div>
          )}
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddSponsorshipOption}
          >
            <Plus className="mr-2 h-4 w-4" />
            Dodaj opcję sponsorowania
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorshipTab;
