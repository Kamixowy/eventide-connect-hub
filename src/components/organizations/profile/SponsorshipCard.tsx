
import React from 'react';
import { FileText, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface SponsorshipCardProps {
  userType: string | null;
}

const SponsorshipCard: React.FC<SponsorshipCardProps> = ({ userType }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          Zainteresowany sponsoringiem?
          <HoverCard>
            <HoverCardTrigger asChild>
              <Info size={16} className="text-muted-foreground cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Korzyści sponsoringu wydarzeń</h4>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Zwiększenie widoczności marki</li>
                  <li>Dotarcie do nowych grup odbiorców</li>
                  <li>Budowanie pozytywnego wizerunku</li>
                  <li>Nawiązanie wartościowych kontaktów biznesowych</li>
                  <li>Możliwość realizacji celów CSR</li>
                </ul>
              </div>
            </HoverCardContent>
          </HoverCard>
        </h3>
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
