
import React from 'react';
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
import { EventCreateValues } from '../EventCreateSchema';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

interface SocialMediaSectionProps {
  methods: UseFormReturn<EventCreateValues>;
}

const SocialMediaSection = ({ methods }: SocialMediaSectionProps) => {
  const { control } = methods;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media społecznościowe</CardTitle>
        <CardDescription>
          Dodaj linki do wydarzenia w mediach społecznościowych
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="facebook">Link do wydarzenia na Facebooku</Label>
              <FormControl>
                <Input 
                  id="facebook" 
                  placeholder="https://facebook.com/events/..." 
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
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="linkedin">Link do wydarzenia na LinkedIn</Label>
              <FormControl>
                <Input 
                  id="linkedin" 
                  placeholder="https://linkedin.com/events/..." 
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

export default SocialMediaSection;
