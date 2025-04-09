
import { Grid3x3, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ViewToggleProps {
  viewType: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

const ViewToggle = ({ viewType, onChange }: ViewToggleProps) => {
  return (
    <ToggleGroup type="single" value={viewType} onValueChange={(v) => v && onChange(v as 'grid' | 'list')} className="border rounded-md">
      <ToggleGroupItem value="grid" aria-label="Widok kafelek" className="px-3">
        <Grid3x3 size={18} />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="Widok listy" className="px-3">
        <List size={18} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
