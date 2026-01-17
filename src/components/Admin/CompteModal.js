import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import adminService from '../../services/adminService';

const CompteModal = ({ isOpen, onClose, onSubmit, compte, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    role: 'MEDECIN',
    numTel: '',
    cabinetId: '',
    specialiteId: '',
    actif: true
  });

  const [errors, setErrors] = useState({});
  const [cabinets, setCabinets] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (compte && mode === 'edit') {
      setFormData({
        nom: compte.nom || '',
        prenom: compte.prenom || '',
        email: compte.email || '',
        motDePasse: '', // Ne pas préremplir le mot de passe
        role: compte.role || 'MEDECIN',
        numTel: compte.numTel || '',
        cabinetId: compte.cabinetId || '',
        specialiteId: compte.specialiteId || '',
        actif: compte.actif !== undefined ? compte.actif : true
      });
    } else if (mode === 'create') {
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        role: 'MEDECIN',
        numTel: '',
        cabinetId: '',
        specialiteId: '',
        actif: true
      });
    }
    setErrors({});
  }, [compte, mode, isOpen]);

  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);
      const [cabinetsRes] = await Promise.all([
        adminService.getCabinets('')
      ]);
      setCabinets(cabinetsRes.data);
      
      // Simuler des spécialités (à remplacer par un vrai appel API si disponible)
      setSpecialites([
        { id: 1, nom: 'Cardiologie' },
        { id: 2, nom: 'Pédiatrie' },
        { id: 3, nom: 'Dermatologie' },
        { id: 4, nom: 'Médecine Générale' },
        { id: 5, nom: 'Neurologie' },
        { id: 6, nom: 'Psychiatrie' }
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des options:', error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (mode === 'create' && !formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est requis';
    } else if (formData.motDePasse && formData.motDePasse.length < 6) {
      newErrors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Ne pas envoyer le mot de passe s'il est vide en mode édition
      const dataToSubmit = { ...formData };
      if (mode === 'edit' && !dataToSubmit.motDePasse) {
        delete dataToSubmit.motDePasse;
      }
      // Convertir les IDs en nombres ou null
      dataToSubmit.cabinetId = dataToSubmit.cabinetId ? parseInt(dataToSubmit.cabinetId) : null;
      dataToSubmit.specialiteId = dataToSubmit.specialiteId ? parseInt(dataToSubmit.specialiteId) : null;
      
      onSubmit(dataToSubmit);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-violet-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {mode === 'create' ? 'Nouveau Compte' : 'Modifier Compte'}
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
            <div className="bg-white px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500`}
                    placeholder="Nom"
                  />
                  {errors.nom && (
                    <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
                  )}
                </div>

                {/* Prénom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.prenom ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500`}
                    placeholder="Prénom"
                  />
                  {errors.prenom && (
                    <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500`}
                  placeholder="email@exemple.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe {mode === 'create' && <span className="text-red-500">*</span>}
                  {mode === 'edit' && <span className="text-gray-500 text-xs">(laissez vide pour ne pas modifier)</span>}
                </label>
                <input
                  type="password"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.motDePasse ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500`}
                  placeholder="••••••••"
                />
                {errors.motDePasse && (
                  <p className="text-red-500 text-xs mt-1">{errors.motDePasse}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rôle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="MEDECIN">Médecin</option>
                    <option value="SECRETAIRE">Secrétaire</option>
                  </select>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="numTel"
                    value={formData.numTel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="0522000000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cabinet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cabinet
                  </label>
                  <select
                    name="cabinetId"
                    value={formData.cabinetId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    disabled={loadingOptions}
                  >
                    <option value="">Sélectionner un cabinet</option>
                    {cabinets.map(cabinet => (
                      <option key={cabinet.id} value={cabinet.id}>{cabinet.nom}</option>
                    ))}
                  </select>
                </div>

                {/* Spécialité (visible seulement pour les médecins) */}
                {formData.role === 'MEDECIN' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Spécialité
                    </label>
                    <select
                      name="specialiteId"
                      value={formData.specialiteId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      disabled={loadingOptions}
                    >
                      <option value="">Sélectionner une spécialité</option>
                      {specialites.map(spec => (
                        <option key={spec.id} value={spec.id}>{spec.nom}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Actif */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="actif"
                  id="actif"
                  checked={formData.actif}
                  onChange={handleChange}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <label htmlFor="actif" className="ml-2 block text-sm text-gray-700">
                  Compte actif
                </label>
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

export default CompteModal;
