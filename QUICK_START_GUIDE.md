# Quick Start Guide - Consultation & Medical Records

## 🚀 Getting Started in 3 Steps

### Step 1: Add Routes
Open your main routes file and add:

```javascript
// Import the modules
import { ConsultationList, ConsultationForm } from './pages/Consultations';
import { DossierMedicalForm, DossierMedicalView } from './pages/DossierMedical';

// Add these routes
<Route path="/medecin/consultations" element={<ConsultationList />} />
<Route path="/medecin/consultations/:patientId" element={<ConsultationForm />} />
<Route path="/medecin/dossier-medical/:patientId/modifier" element={<DossierMedicalForm />} />
```

### Step 2: Add Navigation Link
In your sidebar or navigation menu:

```javascript
import { Stethoscope } from 'lucide-react';

<Link to="/medecin/consultations">
  <Stethoscope className="w-5 h-5 mr-2" />
  Mes Consultations
</Link>
```

### Step 3: Test with Mock Data
Navigate to `/medecin/consultations` - Everything works with mock data!

## 📱 Main Features

### Consultation List
- **URL:** `/medecin/consultations`
- **Features:**
  - View all consultations
  - Filter by date range
  - Filter by status
  - Click "Nouvelle Consultation" to create

### Consultation Form
- **URL:** `/medecin/consultations/:patientId`
- **Features:**
  - Patient info with allergies alert
  - Diagnostic & treatment fields
  - Add medications (with autocomplete)
  - Select examinations
  - Generate PDF prescriptions
  - Save consultation

### Medical Record Form
- **URL:** `/medecin/dossier-medical/:patientId/modifier`
- **Features:**
  - Comprehensive medical history
  - Allergies (highlighted in red)
  - Current diagnosis and treatment
  - Observations

## 🎨 PDF Prescriptions

### Generate Medication Prescription
1. Add medications in consultation form
2. Click "Imprimer ordonnance médicaments"
3. PDF downloads automatically

### Generate Examination Prescription
1. Select examinations in consultation form
2. Add notes if needed
3. Click "Imprimer ordonnance examens"
4. PDF downloads automatically

## 🔧 Customization

### Change Mock Data
Edit the `mockData` arrays in each component:

```javascript
// In ConsultationList.js
const mockConsultations = [
  {
    id: 1,
    date: '2024-01-16',
    patient: { nom: 'Your', prenom: 'Name' },
    // ... add your data
  }
];
```

### Connect to Backend
Replace mock data sections with real API calls:

```javascript
// Replace this:
const mockData = [...];
setConsultations(mockData);

// With this:
const response = await consultationService.getAll();
setConsultations(response.data);
```

## 📋 Required Backend Endpoints

When ready to connect to backend, implement these:

```
GET    /api/consultations
POST   /api/consultations
GET    /api/dossiers-medicaux/patient/:patientId
POST   /api/dossiers-medicaux
PUT    /api/dossiers-medicaux/:id
GET    /api/medicaments/search?q=...
POST   /api/ordonnances
```

## 🎯 Component Props

### DossierMedicalView (can be embedded)
```javascript
<DossierMedicalView 
  patientId="123"
  embedded={true}
/>
```

## 💡 Tips

1. **Mock Data:** All components work standalone with mock data
2. **PDF Generation:** Uses jsPDF - already installed
3. **Validation:** Forms validate before submission
4. **Error Handling:** Toast notifications show errors
5. **Responsive:** Works on mobile, tablet, desktop

## 🐛 Troubleshooting

### Issue: Page won't load
**Solution:** Check that routes are added correctly

### Issue: PDF not generating
**Solution:** Verify jsPDF is installed: `npm list jspdf`

### Issue: Autocomplete not working
**Solution:** Type at least 2 characters to trigger search

### Issue: Can't save form
**Solution:** Check console for validation errors

## 📞 Need Help?

Check these files:
- `CONSULTATION_SUMMARY.md` - Full implementation details
- `src/pages/CONSULTATION_MEDICAL_RECORDS_README.md` - Comprehensive docs
- Console logs - Check for errors

## ✨ Next Steps

1. ✅ Routes added
2. ✅ Navigation working
3. ✅ Test with mock data
4. ⏳ Implement backend APIs
5. ⏳ Replace mock data with real calls
6. ⏳ Deploy to production

---

**All set! Start exploring the features with mock data.**
