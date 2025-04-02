
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EventFormValues } from './EventEditSchema';

interface MediaTabProps {
  uploadedImageUrl: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const MediaTab = ({ uploadedImageUrl, handleImageUpload }: MediaTabProps) => {
  const form = useFormContext<EventFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zdjęcie i media społecznościowe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4">
          <FormLabel>Zdjęcie wydarzenia</FormLabel>
          <div className="mt-2">
            {uploadedImageUrl && (
              <div className="mb-4">
                <img
                  src={uploadedImageUrl}
                  alt="Zdjęcie wydarzenia"
                  className="max-w-full h-40 object-cover rounded-md"
                />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link do wydarzenia na Facebook</FormLabel>
              <FormControl>
                <Input
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
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link do wydarzenia na LinkedIn</FormLabel>
              <FormControl>
                <Input
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

export default MediaTab;
