
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { X, Plus } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventFormValues } from './EventEditSchema';

// Predefined categories and audience types matching those in the event creation form
const categoryOptions = [
  "Sportowe",
  "Kulturalne",
  "Edukacyjne",
  "Charytatywne",
  "Społeczna",
  "Ekologiczne",
  "Technologiczne",
  "Zdrowotne",
  "Biznesowe",
  "Inne"
];

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

interface DetailsTabProps {
  methods: UseFormReturn<EventFormValues>;
}

const DetailsTab = ({ methods }: DetailsTabProps) => {
  const { control, setValue, watch } = methods;
  const [newTag, setNewTag] = useState('');
  
  // Extract audience and tags from form value
  const audienceString = watch('audience') || '';
  const tagsString = watch('tags') || '';
  
  // Convert comma-separated strings to arrays for UI rendering
  const audienceArray = audienceString 
    ? audienceString.split(',').map(item => item.trim()).filter(Boolean) 
    : [];
  const tagsArray = tagsString 
    ? tagsString.split(',').map(item => item.trim()).filter(Boolean) 
    : [];

  // Handle audience selection
  const handleAudienceChange = (audienceType: string) => {
    const isSelected = audienceArray.includes(audienceType);
    const updatedAudience = isSelected
      ? audienceArray.filter(a => a !== audienceType)
      : [...audienceArray, audienceType];
    
    setValue('audience', updatedAudience.join(', '));
  };

  // Handle tag operations
  const handleAddTag = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (newTag && !tagsArray.includes(newTag)) {
      setValue('tags', [...tagsArray, newTag].join(', '));
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const updatedTags = tagsArray.filter(tag => tag !== tagToRemove);
    setValue('tags', updatedTags.join(', '));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lokalizacja i uczestnicy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokalizacja</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Miasto, województwo"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="detailed_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dokładny adres</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ulica, numer, kod pocztowy"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={control}
          name="expected_participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Przewidywana liczba uczestników</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Np. 100"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategoria</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(value)}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kategorię wydarzenia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Grupa docelowa (możesz wybrać kilka)</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {audienceTypes.map((audienceType) => (
              <div key={audienceType} className="flex items-center space-x-2">
                <Checkbox 
                  id={`audience-${audienceType}`} 
                  checked={audienceArray.includes(audienceType)}
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
          <input type="hidden" name="audience" value={audienceString} />
        </div>
        
        <div className="space-y-3">
          <FormLabel>Tagi wydarzenia</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {tagsArray.map((tag) => (
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

export default DetailsTab;
