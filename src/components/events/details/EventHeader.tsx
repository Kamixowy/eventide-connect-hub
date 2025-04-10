
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventHeaderProps {
  title: string;
  status: string;
  banner: string;
  isOwner: boolean;
  eventId: string;
  onStatusChange: (status: string) => void;
  statusOptions: string[];
  statusUpdating: boolean;
}

const EventHeader: React.FC<EventHeaderProps> = ({
  title,
  status,
  banner,
  isOwner,
  eventId,
  onStatusChange,
  statusOptions,
  statusUpdating
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-100">
      {/* Blurred background to fill any gaps */}
      <div className="absolute inset-0" 
        style={{
          backgroundImage: `url(${banner || '/placeholder.svg'})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'blur(8px)',
          opacity: '0.4',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Main image stretched vertically while preserving aspect ratio */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src={banner || '/placeholder.svg'} 
          alt={title} 
          className="h-full w-auto max-h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src = '/placeholder.svg'; 
          }}
        />
      </div>
      
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30 z-10" />
      
      {/* Event title and status */}
      <div className="absolute bottom-6 left-6 md:left-12 z-20">
        <div className={`
          inline-block rounded-full px-3 py-1 text-xs font-medium mb-2 bg-white
          ${status === 'Planowane' ? 'text-blue-700' : 
            status === 'W przygotowaniu' ? 'text-yellow-700' : 
            status === 'W trakcie' ? 'text-green-700' : 
            status === 'Zakończone' ? 'text-gray-700' :
            status === 'Anulowane' ? 'text-red-700' :
            'text-gray-700'}
        `}>
          {status}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white shadow-sm">
          {title}
        </h1>
      </div>
      
      {/* Owner actions */}
      {isOwner && (
        <div className="absolute top-6 right-6 flex gap-2 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white shadow-md"
                disabled={statusUpdating}
              >
                {statusUpdating ? "Aktualizowanie..." : "Zmień status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((statusOption) => (
                <DropdownMenuItem 
                  key={statusOption}
                  onClick={() => onStatusChange(statusOption)}
                  className={status === statusOption ? "font-bold bg-gray-100" : ""}
                >
                  {statusOption}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isOwner && (
            <Button 
              variant="success" 
              className="shadow-md"
              onClick={() => navigate(`/edytuj-wydarzenie/${eventId}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edytuj wydarzenie
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventHeader;
