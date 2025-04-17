import { useState } from 'react';
import { CollaborationOption, SponsorshipOption } from '../types';

export const useCollaborationOptions = () => {
  const [selectedOptions, setSelectedOptions] = useState<CollaborationOption[]>([]);
  
  const toggleOption = (option: SponsorshipOption) => {
    const exists = selectedOptions.some(
      (o) => o.sponsorship_option_id === option.id
    );
    
    if (exists) {
      setSelectedOptions(
        selectedOptions.filter((o) => o.sponsorship_option_id !== option.id)
      );
    } else {
      setSelectedOptions([
        ...selectedOptions,
        {
          title: option.title,
          description: option.description,
          amount: option.price,
          is_custom: false,
          sponsorship_option_id: option.id
        }
      ]);
    }
  };
  
  const addCustomOption = () => {
    setSelectedOptions([
      ...selectedOptions,
      {
        title: 'Nowa opcja',
        description: '',
        amount: 0,
        is_custom: true
      }
    ]);
  };
  
  const removeCustomOption = (index: number) => {
    setSelectedOptions([
      ...selectedOptions.slice(0, index),
      ...selectedOptions.slice(index + 1)
    ]);
  };
  
  const updateCustomOption = (index: number, field: keyof CollaborationOption, value: any) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value
    };
    setSelectedOptions(updatedOptions);
  };
  
  const calculateTotalAmount = () => {
    return selectedOptions.reduce(
      (sum, option) => sum + (option.amount || 0), 
      0
    );
  };

  return {
    selectedOptions,
    toggleOption,
    addCustomOption,
    removeCustomOption,
    updateCustomOption,
    calculateTotalAmount
  };
};
