
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { EventCreateValues } from '../EventCreateSchema';

interface SocialMediaSectionProps {
  methods: UseFormReturn<EventCreateValues>;
}

const SocialMediaSection = ({ methods }: SocialMediaSectionProps) => {
  const { control } = methods;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media społecznościowe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                <FormControl>
                  <Input
                    placeholder="Link do Facebook (opcjonalnie)"
                    className="pl-10"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                <FormControl>
                  <Input
                    placeholder="Link do Instagram (opcjonalnie)"
                    className="pl-10"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                <FormControl>
                  <Input
                    placeholder="Link do LinkedIn (opcjonalnie)"
                    className="pl-10"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default SocialMediaSection;
