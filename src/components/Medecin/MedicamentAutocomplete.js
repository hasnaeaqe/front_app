import React from 'react';
import AsyncSelect from 'react-select/async';
import medecinService from '../../services/medecinService';

const MedicamentAutocomplete = ({ value, onChange, placeholder = "Rechercher un médicament..." }) => {
  const loadMedicaments = async (inputValue) => {
    if (inputValue.length < 2) {
      return [];
    }

    try {
      const response = await medecinService.searchMedicaments(inputValue);
      return response.data.map(m => ({
        value: m.id,
        label: m.nom,
        medicament: m
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche de médicaments:', error);
      return [];
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadMedicaments}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      noOptionsMessage={({ inputValue }) => 
        inputValue.length < 2 
          ? 'Tapez au moins 2 caractères' 
          : 'Aucun médicament trouvé'
      }
      loadingMessage={() => 'Recherche...'}
      styles={{
        control: (base) => ({
          ...base,
          borderColor: '#d1d5db',
          '&:hover': {
            borderColor: '#9ca3af'
          },
          '&:focus-within': {
            borderColor: '#06b6d4',
            boxShadow: '0 0 0 3px rgba(6, 182, 212, 0.1)'
          }
        })
      }}
    />
  );
};

export default MedicamentAutocomplete;
