
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SelectedOrganizationProps {
  organization: any;
  onChangeOrganization: () => void;
}

const SelectedOrganization = ({ organization, onChangeOrganization }: SelectedOrganizationProps) => {
  if (!organization) return null;
  
  return (
    <div className="p-3 border rounded-md mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={organization.organization?.logo_url || organization.avatar_url} 
              alt={organization.organization?.name || organization.name} 
            />
            <AvatarFallback>
              {(organization.organization?.name || organization.name)?.substring(0, 2) || 'OR'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{organization.organization?.name || organization.name}</h3>
            {organization.user_type && (
              <Badge 
                variant="outline"
                className={`text-xs px-1.5 py-0 ${
                  organization.user_type === 'organization' 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' 
                    : 'bg-green-50 text-green-700 hover:bg-green-50'
                }`}
              >
                {organization.user_type === 'organization' ? 'Organizacja' : 'Sponsor'}
              </Badge>
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onChangeOrganization}
        >
          Zmień
        </Button>
      </div>
    </div>
  );
};

export default SelectedOrganization;
