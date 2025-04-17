
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Grid, List, Search } from 'lucide-react';

interface CollaborationFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export const CollaborationFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters
}: CollaborationFiltersProps) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="flex-1 flex items-center relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Szukaj współprac..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-muted' : ''}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <div className="flex border rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewMode('grid')} 
              className={`rounded-r-none ${viewMode === 'grid' ? 'bg-muted' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewMode('list')} 
              className={`rounded-l-none ${viewMode === 'list' ? 'bg-muted' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mb-4 bg-muted/30 rounded-lg">
          <div>
            <label className="text-sm font-medium block mb-2">Status</label>
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wszystkie statusy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie statusy</SelectItem>
                <SelectItem value="Przesłana">Przesłana</SelectItem>
                <SelectItem value="Negocjacje">Negocjacje</SelectItem>
                <SelectItem value="W trakcie">W trakcie</SelectItem>
                <SelectItem value="Zrealizowana">Zrealizowana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
