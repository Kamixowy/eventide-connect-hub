
import React from 'react';
import { useFormContext } from 'react-hook-form';
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

const BasicInfoSection = () => {
  const { register, setValue, watch } = useFormContext();
  const category = watch('category');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Podstawowe informacje</CardTitle>
        <CardDescription>
          Podaj podstawowe informacje o Twoim wydarzeniu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Nazwa wydarzenia *</Label>
          <Input 
            id="title" 
            placeholder="Np. Bieg Charytatywny 'Pomagamy Dzieciom'" 
            {...register('title')}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Kategoria *</Label>
          <Select 
            value={category} 
            onValueChange={(value) => setValue('category', value)}
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Opis wydarzenia *</Label>
          <Textarea 
            id="description" 
            placeholder="Opisz swoje wydarzenie. Im więcej szczegółów podasz, tym większa szansa na znalezienie odpowiednich sponsorów." 
            className="min-h-[150px]"
            {...register('description')}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
