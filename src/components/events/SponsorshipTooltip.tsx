
import React from 'react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Award, Check } from 'lucide-react';

interface SponsorshipTooltipProps {
  benefits: string[];
  children: React.ReactNode;
}

const SponsorshipTooltip: React.FC<SponsorshipTooltipProps> = ({ benefits, children }) => {
  if (!benefits || benefits.length === 0) {
    return <>{children}</>;
  }
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="p-0 max-w-[300px]">
          <div className="bg-background border rounded-md overflow-hidden">
            <div className="bg-muted/50 p-2 border-b flex items-center gap-2">
              <Award size={16} className="text-ngo" />
              <span className="font-medium">Korzyści współpracy</span>
            </div>
            <div className="p-3">
              <ul className="space-y-1.5">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="mt-0.5 text-green-600 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SponsorshipTooltip;
