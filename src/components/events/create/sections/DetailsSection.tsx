
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, X, Plus } from 'lucide-react';
import { EventCreateValues } from '../EventCreateSchema';

const audienceTypes = [
  "Dzieci",
  "Młodzież",
  "Dorośli",
  "Seniorzy",
  "Rodziny z dziećmi",
  "Osoby z niepełnosprawnościami",
  "Społeczność lokalna",
  "Sportowcy",
  "Profesjonaliści",
  "Firmy",
  "Wolontariusze"
];

interface DetailsSectionProps {
  methods: UseFormReturn<EventCreateValues>;
}

const DetailsSection = ({ methods }: DetailsSectionProps) => {
  const { setValue, watch } = methods;
  const [newTag, setNewTag] = useState('');
  const audience = watch('audience') || [];
  const tags = watch('tags') || [];

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setValue('expected_participants', value);
  };

  const handleAudienceChange = (audienceType: string) => {
    const updatedAudience = audience.includes(audienceType)
      ? audience.filter(a => a !== audienceType)
      : [...audience, audienceType];
    
    setValue('audience', updatedAudience);
  };

  const handleAddTag = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (newTag && !tags.includes(newTag)) {
      setValue('tags', [...tags, newTag]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Szczegóły wydarzenia</CardTitle>
        <CardDescription>
          Dodaj więcej szczegółów, aby lepiej opisać swoje wydarzenie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="expected_participants">Przewidywana liczba uczestników</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
            <Input 
              id="expected_participants" 
              type="text" 
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Np. 100" 
              className="pl-10"
              value={watch('expected_participants') || ''}
              onChange={handleNumberChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Grupa docelowa (możesz wybrać kilka)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {audienceTypes.map((audienceType) => (
              <div key={audienceType} className="flex items-center space-x-2">
                <Checkbox 
                  id={`audience-${audienceType}`} 
                  checked={audience.includes(audienceType)}
                  onCheckedChange={() => handleAudienceChange(audienceType)}
                />
                <label 
                  htmlFor={`audience-${audienceType}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {audienceType}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Tagi wydarzenia</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-3 py-1">
                {tag}
                <button 
                  type="button" 
                  className="ml-2 hover:text-destructive"
                  onClick={(e) => handleRemoveTag(tag, e)}
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input 
              placeholder="Dodaj tag" 
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddTag}
            >
              <Plus size={16} className="mr-2" /> Dodaj
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Tagi pomogą sponsorom znaleźć Twoje wydarzenie. Np. sport, edukacja, ekologia, etc.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsSection;
