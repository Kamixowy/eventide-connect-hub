
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { EventFormValues } from './EventEditSchema';

interface BasicInfoTabProps {
  methods: UseFormReturn<EventFormValues>;
}

const BasicInfoTab = ({ methods }: BasicInfoTabProps) => {
  const { control } = methods;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Podstawowe informacje</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł wydarzenia*</FormLabel>
              <FormControl>
                <Input placeholder="Nazwa wydarzenia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis wydarzenia*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Opisz swoje wydarzenie..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data rozpoczęcia*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "dd.MM.yyyy")
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data zakończenia</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "dd.MM.yyyy")
                        ) : (
                          <span>Wybierz datę (opcjonalnie)</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoTab;
