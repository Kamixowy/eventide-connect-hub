
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface OrganizationSearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const OrganizationSearchInput = ({ searchQuery, setSearchQuery }: OrganizationSearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <Input
        placeholder="Szukaj organizacji..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default OrganizationSearchInput;
