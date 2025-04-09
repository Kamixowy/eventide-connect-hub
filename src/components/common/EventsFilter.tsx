
import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ViewToggle from '@/components/common/ViewToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export type SortOption = 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc' | 'participants-asc' | 'participants-desc';
export type FilterOption = string;

interface EventsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewType: 'grid' | 'list';
  setViewType: (view: 'grid' | 'list') => void;
  sortOption?: SortOption;
  setSortOption?: (option: SortOption) => void;
  availableFilters?: { label: string, value: string }[];
  activeFilters?: FilterOption[];
  setActiveFilters?: (filters: FilterOption[]) => void;
}

const EventsFilter = ({
  searchQuery,
  setSearchQuery,
  viewType,
  setViewType,
  sortOption = 'date-desc',
  setSortOption = () => {},
  availableFilters = [],
  activeFilters = [],
  setActiveFilters = () => {},
}: EventsFilterProps) => {
  const hasActiveFilters = activeFilters.length > 0;

  // Handle clearing all filters
  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Szukaj..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        {availableFilters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className={hasActiveFilters ? "border-primary bg-primary/10" : ""}>
                <Filter size={18} className={hasActiveFilters ? "text-primary" : ""} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtruj według</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Status filters section */}
              {availableFilters.filter(f => !f.value.startsWith('category:')).length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Status</DropdownMenuLabel>
                  {availableFilters
                    .filter(filter => !filter.value.startsWith('category:'))
                    .map((filter) => (
                      <DropdownMenuCheckboxItem
                        key={filter.value}
                        checked={activeFilters.includes(filter.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setActiveFilters([...activeFilters, filter.value]);
                          } else {
                            setActiveFilters(activeFilters.filter(f => f !== filter.value));
                          }
                        }}
                      >
                        {filter.label}
                      </DropdownMenuCheckboxItem>
                    ))
                  }
                </>
              )}
              
              {/* Separator between status and category filters */}
              {availableFilters.some(f => !f.value.startsWith('category:')) && 
               availableFilters.some(f => f.value.startsWith('category:')) && (
                <Separator className="my-2 h-[2px] bg-muted-foreground/20" />
              )}
              
              {/* Category filters section */}
              {availableFilters.filter(f => f.value.startsWith('category:')).length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Kategoria</DropdownMenuLabel>
                  {availableFilters
                    .filter(filter => filter.value.startsWith('category:'))
                    .map((filter) => (
                      <DropdownMenuCheckboxItem
                        key={filter.value}
                        checked={activeFilters.includes(filter.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setActiveFilters([...activeFilters, filter.value]);
                          } else {
                            setActiveFilters(activeFilters.filter(f => f !== filter.value));
                          }
                        }}
                      >
                        {filter.label}
                      </DropdownMenuCheckboxItem>
                    ))
                  }
                </>
              )}
              
              {/* Clear filters button */}
              {hasActiveFilters && (
                <>
                  <Separator className="my-2 h-[2px] bg-muted-foreground/20" />
                  <div className="px-2 py-1.5">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs justify-center" 
                      onClick={handleClearFilters}
                    >
                      <X size={14} className="mr-1" /> Wyczyść filtry
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <ArrowUpDown size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sortuj według</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortOption('date-desc')}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Daty (najnowsze)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption('date-asc')}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Daty (najstarsze)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption('title-asc')}>
              <span className="mr-2">A-Z</span>
              <span>Tytułu (A-Z)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption('title-desc')}>
              <span className="mr-2">Z-A</span>
              <span>Tytułu (Z-A)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption('participants-desc')}>
              <span className="mr-2">↓</span>
              <span>Uczestników (najwięcej)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption('participants-asc')}>
              <span className="mr-2">↑</span>
              <span>Uczestników (najmniej)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <ViewToggle viewType={viewType} onChange={setViewType} />
      </div>
    </div>
  );
};

export default EventsFilter;
