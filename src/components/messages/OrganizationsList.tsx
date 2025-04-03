
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface OrganizationsListProps {
  organizations: any[];
  isLoading: boolean;
  onSelectOrganization: (organization: any) => void;
  filteredOrganizations: any[];
}

const OrganizationsList = ({ 
  filteredOrganizations, 
  isLoading, 
  onSelectOrganization 
}: OrganizationsListProps) => {
  return (
    <ScrollArea className="flex-grow border rounded-md h-[200px] mb-4">
      {isLoading ? (
        <div className="p-4 text-center text-muted-foreground flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Ładowanie organizacji...
        </div>
      ) : filteredOrganizations.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          Nie znaleziono organizacji spełniających kryteria wyszukiwania
        </div>
      ) : (
        <div className="divide-y">
          {filteredOrganizations.map((org) => (
            <div
              key={org.id}
              className="p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectOrganization(org)}
            >
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage 
                    src={org.organization?.logo_url || org.avatar_url} 
                    alt={org.organization?.name || org.name} 
                  />
                  <AvatarFallback>
                    {(org.organization?.name || org.name)?.substring(0, 2) || 'OR'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {org.organization?.name || org.name}
                  </p>
                  <div className="mt-1">
                    {org.user_type && (
                      <Badge 
                        variant="outline"
                        className={`text-xs px-1.5 py-0 ${
                          org.user_type === 'organization' 
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' 
                            : 'bg-green-50 text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {org.user_type === 'organization' ? 'Organizacja' : 'Sponsor'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default OrganizationsList;
