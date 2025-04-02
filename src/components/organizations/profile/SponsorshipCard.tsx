
import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SponsorshipCardProps {
  userType: string | null;
}

const SponsorshipCard: React.FC<SponsorshipCardProps> = ({ userType }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Zainteresowany sponsoringiem?</h3>
        <p className="text-muted-foreground mb-4">
          Sprawdź aktualne wydarzenia tej organizacji i nawiąż współpracę!
        </p>
        <Button className="w-full btn-gradient">
          <FileText size={16} className="mr-2" /> Zobacz ofertę współpracy
        </Button>
      </CardContent>
    </Card>
  );
};

export default SponsorshipCard;
