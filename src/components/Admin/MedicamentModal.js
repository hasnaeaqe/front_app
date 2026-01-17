import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const MedicamentModal = ({ isOpen, onClose, onSubmit, medicament, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    posologie: '',
    categorie: '',
    fabricant: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (medicament && mode === 'edit') {
      setFormData({
        nom: medicament.nom || '',
        description: medicament.description || '',
        posologie: medicament.posologie || '',
        categorie: medicament.categorie || '',
        fabricant: medicament.fabricant || ''
      });
    } else if (mode === 'create') {
      setFormData({
        nom: '',
        description: '',
        posologie: '',
        categorie: '',
        fabricant: ''
      });
    }
    setErrors({});
  }, [medicament, mode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  const categories = [
    'Antibiotique',
    'Antalgique',
    'Anti-inflammatoire',
    'Antiviral',
    'Antihistaminique',
    'Antipyrétique',
    'Antidiabétique',
    'Antihypertenseur',
    'Autre'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-violet-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {mode === 'create' ? 'Nouveau Médicament' : 'Modifier Médicament'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-4 space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du Médicament <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500`}
                  placeholder="Ex: Paracétamol"
                />
                {errors.nom && (
                  <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
                )}
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Fabricant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fabricant
                </label>
                <input
                  type="text"
                  name="fabricant"
                  value={formData.fabricant}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Ex: Pfizer"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Description du médicament"
                />
              </div>

              {/* Posologie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posologie
                </label>
                <textarea
                  name="posologie"
                  value={formData.posologie}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Ex: 1 comprimé 3 fois par jour"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {mode === 'create' ? 'Créer' : 'Modifier'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicamentModal;
