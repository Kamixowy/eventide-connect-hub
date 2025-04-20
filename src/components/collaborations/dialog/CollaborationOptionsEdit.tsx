
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { CollaborationType } from "@/types/collaboration";
import { CollaborationOption } from "@/services/collaborations/types";
import { updateCollaborationOptions } from "@/services/collaborations";
import { useToast } from "@/hooks/use-toast";

interface CollaborationOptionsEditProps {
  collaboration: CollaborationType;
  onSave: () => void;
  onCancel: () => void;
}

const CollaborationOptionsEdit = ({
  collaboration,
  onSave,
  onCancel
}: CollaborationOptionsEditProps) => {
  const { toast } = useToast();
  const [options, setOptions] = useState<CollaborationOption[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize options from collaboration
  useEffect(() => {
    const collaborationOptions = collaboration.collaboration_options || 
                               collaboration.options || [];
    setOptions([...collaborationOptions]);
    calculateTotal([...collaborationOptions]);
  }, [collaboration]);

  const addNewOption = () => {
    const newOption: CollaborationOption = {
      title: 'Nowa opcja',
      description: '',
      amount: 0,
      is_custom: true
    };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    calculateTotal(updatedOptions);
  };

  const removeOption = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
    calculateTotal(updatedOptions);
  };

  const updateOption = (index: number, field: keyof CollaborationOption, value: any) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : value
    };
    setOptions(updatedOptions);
    if (field === 'amount') {
      calculateTotal(updatedOptions);
    }
  };

  const calculateTotal = (optionsList: CollaborationOption[]) => {
    const total = optionsList.reduce(
      (sum, option) => sum + (parseFloat(String(option.amount)) || 0), 
      0
    );
    setTotalAmount(total);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateCollaborationOptions(collaboration.id, options, totalAmount);
      toast({
        title: "Opcje zaktualizowane",
        description: "Opcje współpracy zostały pomyślnie zaktualizowane"
      });
      onSave();
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować opcji współpracy",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Edytuj opcje współpracy</h3>
      
      <div className="space-y-4">
        {options.map((option, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <Input 
                value={option.title}
                onChange={(e) => updateOption(index, 'title', e.target.value)}
                className="w-3/4"
                placeholder="Tytuł opcji"
              />
              <Input 
                type="number"
                value={option.amount}
                onChange={(e) => updateOption(index, 'amount', e.target.value)}
                className="w-1/4 ml-2"
                placeholder="Kwota"
              />
            </div>
            
            <Textarea 
              value={option.description || ''}
              onChange={(e) => updateOption(index, 'description', e.target.value)}
              placeholder="Opis opcji"
              className="min-h-[80px]"
            />
            
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeOption(index)}
                className="text-red-500"
              >
                <Trash className="w-4 h-4 mr-2" /> Usuń opcję
              </Button>
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          onClick={addNewOption}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" /> Dodaj nową opcję
        </Button>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Łączna kwota</h3>
        <p className="text-3xl font-bold">{totalAmount} PLN</p>
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Anuluj
        </Button>
        <Button 
          className="btn-gradient"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </Button>
      </div>
    </div>
  );
};

export default CollaborationOptionsEdit;
