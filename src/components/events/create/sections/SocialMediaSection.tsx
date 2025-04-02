
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
import { Facebook, Linkedin, Instagram } from 'lucide-react';

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
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                  <Input 
                    id="facebook" 
                    placeholder="https://facebook.com/events/..." 
                    className="pl-10"
                    {...field}
                    value={field.value || ''}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="instagram">Link do wydarzenia na Instagramie</Label>
              <FormControl>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                  <Input 
                    id="instagram" 
                    placeholder="https://instagram.com/p/..." 
                    className="pl-10"
                    {...field}
                    value={field.value || ''}
                  />
                </div>
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
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                  <Input 
                    id="linkedin" 
                    placeholder="https://linkedin.com/events/..." 
                    className="pl-10"
                    {...field}
                    value={field.value || ''}
                  />
                </div>
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
