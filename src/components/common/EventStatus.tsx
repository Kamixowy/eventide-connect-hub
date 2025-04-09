
import { Badge } from '@/components/ui/badge';

interface EventStatusProps {
  status: string;
}

const EventStatus = ({ status }: EventStatusProps) => {
  const getStatusProps = () => {
    switch (status) {
      case 'Planowane':
        return {
          color: 'bg-blue-100 text-blue-700',
          text: 'Planowane'
        };
      case 'W przygotowaniu':
        return {
          color: 'bg-yellow-100 text-yellow-700',
          text: 'W przygotowaniu'
        };
      case 'W trakcie':
        return {
          color: 'bg-green-100 text-green-700',
          text: 'W trakcie'
        };
      case 'Zakończone':
        return {
          color: 'bg-gray-100 text-gray-700',
          text: 'Zakończone'
        };
      case 'Odwołane':
        return {
          color: 'bg-red-100 text-red-700',
          text: 'Odwołane'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700',
          text: status
        };
    }
  };

  const { color, text } = getStatusProps();

  return (
    <Badge className={`font-medium ${color}`} variant="outline">
      {text}
    </Badge>
  );
};

export default EventStatus;
