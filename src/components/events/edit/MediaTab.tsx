
import React, { useState } from 'react';
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
import { Loader2 } from 'lucide-react';

interface MediaTabProps {
  uploadedImageUrl: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const MediaTab = ({ uploadedImageUrl, handleImageUpload }: MediaTabProps) => {
  const form = useFormContext<EventFormValues>();
  const [isUploading, setIsUploading] = useState(false);

  // Wrap the original handler to show loading state
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    try {
      await handleImageUpload(e);
    } finally {
      setIsUploading(false);
    }
  };

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
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className={isUploading ? "opacity-50" : ""}
              />
              {isUploading && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="animate-spin h-5 w-5 text-primary" />
                </div>
              )}
            </div>
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
