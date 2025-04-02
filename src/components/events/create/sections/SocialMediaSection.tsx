
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const SocialMediaSection = () => {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media społecznościowe</CardTitle>
        <CardDescription>
          Dodaj linki do wydarzenia w mediach społecznościowych
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="facebook">Link do wydarzenia na Facebooku</Label>
          <Input 
            id="facebook" 
            placeholder="https://facebook.com/events/..." 
            {...register('facebook')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="linkedin">Link do wydarzenia na LinkedIn</Label>
          <Input 
            id="linkedin" 
            placeholder="https://linkedin.com/events/..." 
            {...register('linkedin')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaSection;
