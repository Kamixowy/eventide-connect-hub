
interface CollaborationOptionsProps {
  collaboration: any;
}

const CollaborationOptions = ({ collaboration }: CollaborationOptionsProps) => {
  // Get sponsorship options
  const sponsorshipOptions = collaboration.sponsorshipOptions || 
    collaboration.options?.map((o: any) => o.sponsorship_options) || [];
  
  // Get total amount
  const totalAmount = collaboration.total_amount || 
    collaboration.totalAmount || 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Opcje sponsoringu</h3>
        
        {sponsorshipOptions && sponsorshipOptions.length > 0 ? (
          <div className="space-y-4">
            {sponsorshipOptions.map((option: any, index: number) => (
              <div 
                key={index} 
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{option.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {option.description || 'Brak opisu'}
                    </p>
                    
                    {option.benefits && option.benefits.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {option.benefits.map((benefit: string, i: number) => (
                          <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="font-bold text-lg">
                    {option.amount || option.price || 0} PLN
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Brak wybranych opcji sponsoringu
          </p>
        )}
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Łączna kwota</h3>
        <p className="text-3xl font-bold">{totalAmount} PLN</p>
      </div>
    </div>
  );
};

export default CollaborationOptions;
