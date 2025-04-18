
import { CollaborationType } from "@/types/collaboration";

interface CollaborationOptionsListProps {
  collaboration: CollaborationType;
}

const CollaborationOptionsList = ({ collaboration }: CollaborationOptionsListProps) => {
  const options = collaboration.collaboration_options || collaboration.options || [];
  const totalAmount = collaboration.total_amount || collaboration.totalAmount || 0;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Opcje sponsoringu</h3>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{option.title}</p>
                <p className="text-sm text-muted-foreground">
                  {option.description || 'Brak opisu'}
                </p>
              </div>
              <p className="font-bold">{option.amount} PLN</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t mt-6 pt-4">
        <h3 className="text-xl font-semibold mb-2">Łączna kwota</h3>
        <p className="text-3xl font-bold">{totalAmount} PLN</p>
      </div>
    </div>
  );
};

export default CollaborationOptionsList;
