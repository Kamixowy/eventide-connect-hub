
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
        className="pl-10 pr-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
          onClick={() => setSearchQuery("")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Wyczyść wyszukiwanie</span>
        </Button>
      )}
    </div>
  );
};

export default OrganizationSearchInput;
