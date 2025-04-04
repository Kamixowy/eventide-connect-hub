
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
import { Calendar, MapPin } from 'lucide-react';
import { EventCreateValues } from '../EventCreateSchema';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

interface DateLocationSectionProps {
  methods: UseFormReturn<EventCreateValues>;
}

const DateLocationSection = ({ methods }: DateLocationSectionProps) => {
  const { control, watch, setValue, register } = methods;
  const voivodeship = watch('voivodeship');
  const startDate = watch('start_date');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data i lokalizacja</CardTitle>
        <CardDescription>
          Określ kiedy i gdzie odbędzie się wydarzenie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data rozpoczęcia *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
              <Input 
                id="startDate" 
                type="date" 
                className="pl-10" 
                {...register('start_date', {
                  valueAsDate: true,
                })}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">Data zakończenia (opcjonalnie)</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
              <Input 
                id="endDate" 
                type="date" 
                className="pl-10" 
                {...register('end_date', {
                  valueAsDate: true,
                  required: false, // Wyraźnie zaznaczamy, że pole jest opcjonalne
                })}
                min={startDate ? new Date(startDate).toISOString().split('T')[0] : undefined}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Miasto *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
              <Input 
                id="city" 
                placeholder="Np. Warszawa" 
                className="pl-10" 
                {...register('city')}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="voivodeship">Województwo *</Label>
            <Select 
              value={voivodeship} 
              onValueChange={(value) => setValue('voivodeship', value)}
              required
            >
              <SelectTrigger id="voivodeship">
                <SelectValue placeholder="Wybierz województwo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dolnośląskie">Dolnośląskie</SelectItem>
                <SelectItem value="kujawsko-pomorskie">Kujawsko-pomorskie</SelectItem>
                <SelectItem value="lubelskie">Lubelskie</SelectItem>
                <SelectItem value="lubuskie">Lubuskie</SelectItem>
                <SelectItem value="łódzkie">Łódzkie</SelectItem>
                <SelectItem value="małopolskie">Małopolskie</SelectItem>
                <SelectItem value="mazowieckie">Mazowieckie</SelectItem>
                <SelectItem value="opolskie">Opolskie</SelectItem>
                <SelectItem value="podkarpackie">Podkarpackie</SelectItem>
                <SelectItem value="podlaskie">Podlaskie</SelectItem>
                <SelectItem value="pomorskie">Pomorskie</SelectItem>
                <SelectItem value="śląskie">Śląskie</SelectItem>
                <SelectItem value="świętokrzyskie">Świętokrzyskie</SelectItem>
                <SelectItem value="warmińsko-mazurskie">Warmińsko-mazurskie</SelectItem>
                <SelectItem value="wielkopolskie">Wielkopolskie</SelectItem>
                <SelectItem value="zachodniopomorskie">Zachodniopomorskie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="detailed_location">Dokładna lokalizacja</Label>
          <Input 
            id="detailed_location" 
            placeholder="Np. Park Miejski, ul. Przykładowa 123" 
            {...register('detailed_location')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DateLocationSection;
