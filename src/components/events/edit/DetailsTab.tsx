
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EventFormValues } from './EventEditSchema';

interface DetailsTabProps {
  methods: UseFormReturn<EventFormValues>;
}

const DetailsTab = ({ methods }: DetailsTabProps) => {
  const { control } = methods;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lokalizacja i uczestnicy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
              <FormControl>
                <Input
                  placeholder="Np. Sportowe, Kulturalne, Edukacyjne"
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
          name="audience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Odbiorcy (oddzieleni przecinkami)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Np. Rodziny z dziećmi, Seniorzy, Młodzież"
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
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagi (oddzielone przecinkami)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Np. sport, fundraising, pomoc"
                  {...field}
                  value={field.value || ''}
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

export default DetailsTab;
