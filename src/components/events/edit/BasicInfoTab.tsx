
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventFormValues, statusOptions } from './EventEditSchema';

interface BasicInfoTabProps {
  methods: UseFormReturn<EventFormValues>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ methods }) => {
  // Basic Info Tab implementation
  return (
    <Card>
      <CardHeader>
        <CardTitle>Podstawowe informacje</CardTitle>
        <CardDescription>
          Podstawowe dane wydarzenia
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={methods.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł wydarzenia*</FormLabel>
              <FormControl>
                <Input placeholder="Wpisz tytuł..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={methods.control}
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
            control={methods.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data rozpoczęcia*</FormLabel>
                <DatePicker 
                  date={field.value} 
                  setDate={(date) => field.onChange(date)} 
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={methods.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data zakończenia</FormLabel>
                <DatePicker 
                  date={field.value} 
                  setDate={(date) => field.onChange(date)} 
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={methods.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status wydarzenia</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default BasicInfoTab;
