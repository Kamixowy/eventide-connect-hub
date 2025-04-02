
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EventCreateValues } from '../EventCreateSchema';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

const categories = [
  "Charytatywne",
  "Sportowe",
  "Kulturalne",
  "Edukacyjne",
  "Ekologiczne",
  "Zdrowotne",
  "Społeczne",
  "Religijne",
  "Inne"
];

interface BasicInfoSectionProps {
  methods: UseFormReturn<EventCreateValues>;
}

const BasicInfoSection = ({ methods }: BasicInfoSectionProps) => {
  const { control } = methods;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Podstawowe informacje</CardTitle>
        <CardDescription>
          Podaj podstawowe informacje o Twoim wydarzeniu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="title">Nazwa wydarzenia *</Label>
              <FormControl>
                <Input 
                  id="title" 
                  placeholder="Np. Bieg Charytatywny 'Pomagamy Dzieciom'" 
                  {...field}
                  required
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
              <Label htmlFor="category">Kategoria *</Label>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem 
                      key={cat} 
                      value={cat}
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="description">Opis wydarzenia *</Label>
              <FormControl>
                <Textarea 
                  id="description" 
                  placeholder="Opisz swoje wydarzenie. Im więcej szczegółów podasz, tym większa szansa na znalezienie odpowiednich sponsorów." 
                  className="min-h-[150px]"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
