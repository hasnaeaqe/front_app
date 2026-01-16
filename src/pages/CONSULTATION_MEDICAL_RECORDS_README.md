# Consultation and Medical Record Management Pages

## Overview
This documentation covers the comprehensive consultation and medical record management system for doctors in the medical cabinet application.

## Created Files

### Services
1. **`src/services/dossierMedicalService.js`**
   - CRUD operations for medical records
   - Methods: `getAll`, `getById`, `getByPatient`, `create`, `update`

2. **`src/services/medicamentService.js`** (Updated)
   - Added `search(query)` method for medication autocomplete

### Consultations Module (`src/pages/Consultations/`)

#### 1. ConsultationList.js
**Purpose:** Display and manage all consultations for the current doctor

**Features:**
- List all consultations with patient info, diagnostic, duration, status
- Filter by date range (from/to)
- Filter by status (Toutes, En cours, Terminée)
- View consultation details in modal
- Navigate to create new consultation
- Responsive table with badges and icons

**State Management:**
- `consultations` - Array of all consultations
- `filteredConsultations` - Filtered results
- `dateFrom`, `dateTo` - Date range filters
- `statusFilter` - Status filter
- `loading`, `error` - Loading and error states

**API Endpoints (To be implemented):**
- `GET /api/consultations?medecinId=...&date=...&statut=...`
- `GET /api/consultations/:id`

**Navigation:**
- To new consultation: `/medecin/consultations/nouvelle`
- Currently uses mock data for development

---

#### 2. ConsultationForm.js
**Purpose:** Create new consultation with complete medical documentation

**Features:**
- Patient information display with allergies alert
- Consultation form (diagnostic, traitement, observations, durée)
- Dynamic medication management:
  - Autocomplete search for medications
  - Add/remove medications with posologie, durée, quantité
  - Medication list display
- Medical examination checklist:
  - Common exams (Analyses de sang, Radiographie, etc.)
  - Custom exams field
  - Additional notes
- PDF generation for two types of prescriptions:
  - Medication prescription
  - Examination prescription
- Form validation
- Save consultation with all associated data

**State Management:**
- `patient`, `dossierMedical` - Patient data
- `formData` - Consultation form fields
- `medicaments` - Array of added medications
- `medicamentSearch`, `medicamentOptions` - Medication search
- `examens` - Examination checkboxes
- `autresExamens`, `examenNotes` - Examination details
- `loading`, `saving`, `error` - UI states

**API Endpoints (To be implemented):**
- `GET /api/patients/:patientId`
- `GET /api/dossiers-medicaux/patient/:patientId`
- `GET /api/medicaments/search?q=...`
- `POST /api/consultations`
- `POST /api/ordonnances`

**PDF Generation:**
Uses `OrdonnanceTemplate.js` functions to generate professional prescriptions

---

#### 3. OrdonnanceTemplate.js
**Purpose:** PDF generation helpers for prescriptions

**Functions:**

1. **`generateOrdonnanceMedicaments(data)`**
   - Generates medication prescription PDF
   - Parameters:
     ```javascript
     {
       doctor: { nom, prenom, specialite, telephone },
       patient: { nom, prenom, age, mutuelle },
       medicaments: [{ nom, posologie, duree, quantite }],
       date: Date
     }
     ```
   - Creates professional PDF with header, patient info, medication list, footer
   - Returns filename

2. **`generateOrdonnanceExamens(data)`**
   - Generates medical examination prescription PDF
   - Parameters:
     ```javascript
     {
       doctor: { nom, prenom, specialite, telephone },
       patient: { nom, prenom, age, mutuelle },
       examens: ['Analyses de sang', ...],
       notes: 'Additional notes',
       date: Date
     }
     ```
   - Creates professional PDF with exam list and notes
   - Returns filename

**PDF Features:**
- Professional header with doctor info
- Patient information section
- Properly formatted lists
- Footer with signature area and validity
- Page overflow handling

---

### Medical Records Module (`src/pages/DossierMedical/`)

#### 4. DossierMedicalForm.js
**Purpose:** Create or edit medical record for a patient

**Features:**
- Patient header with basic info
- Comprehensive medical record form:
  - Antécédents médicaux (textarea)
  - Antécédents chirurgicaux (textarea)
  - Allergies (highlighted in red, critical field)
  - Habitudes de vie (textarea)
  - Diagnostic actuel (textarea)
  - Traitement actuel (textarea)
  - Observations générales (textarea)
- Create new record or update existing
- Form validation
- Navigation back to patient profile

**State Management:**
- `patient` - Patient data
- `dossierMedical` - Existing medical record
- `formData` - All form fields
- `isEditing` - Boolean for create/edit mode
- `loading`, `saving`, `error` - UI states

**API Endpoints (To be implemented):**
- `GET /api/patients/:patientId`
- `GET /api/dossiers-medicaux/patient/:patientId`
- `POST /api/dossiers-medicaux`
- `PUT /api/dossiers-medicaux/:id`

**Special Features:**
- Allergies field highlighted with red border and warning
- Large textareas for comprehensive documentation
- Auto-detect create vs. edit mode

---

#### 5. DossierMedicalView.js
**Purpose:** Read-only view of medical record (can be embedded in PatientProfile)

**Features:**
- Display medical record in organized sections
- Allergies highlighted in red with warning badge
- Each section with appropriate icon
- Edit button to switch to form
- Empty state handling
- Can be used standalone or embedded

**Props:**
- `patientId` - Patient ID (from props or URL params)
- `embedded` - Boolean for embedded mode

**Sections Displayed:**
- Allergies (highlighted, critical)
- Antécédents médicaux
- Antécédents chirurgicaux
- Habitudes de vie
- Diagnostic actuel
- Traitement actuel
- Observations générales

**Features:**
- Sections only shown if data exists
- Whitespace-pre-line for multi-line text
- Last modification date
- Navigate to edit mode

---

## Integration Guide

### 1. Add Routes
Add these routes to your router configuration:

```javascript
// In your Routes file
import { ConsultationList, ConsultationForm } from './pages/Consultations';
import { DossierMedicalForm, DossierMedicalView } from './pages/DossierMedical';

// Routes
<Route path="/medecin/consultations" element={<ConsultationList />} />
<Route path="/medecin/consultations/nouvelle" element={<ConsultationForm />} />
<Route path="/medecin/consultations/:patientId" element={<ConsultationForm />} />
<Route path="/medecin/dossier-medical/:patientId/nouveau" element={<DossierMedicalForm />} />
<Route path="/medecin/dossier-medical/:patientId/modifier" element={<DossierMedicalForm />} />
<Route path="/medecin/dossier-medical/:patientId" element={<DossierMedicalView />} />
```

### 2. Navigation Links
Add links in your navigation/sidebar:

```javascript
<Link to="/medecin/consultations">Mes Consultations</Link>
```

### 3. Patient Profile Integration
Embed DossierMedicalView in PatientProfile:

```javascript
import { DossierMedicalView } from '../DossierMedical';

// In PatientProfile component
<DossierMedicalView patientId={patientId} embedded={true} />
```

### 4. Backend API Requirements

#### Consultations API
```
GET    /api/consultations?medecinId=...&date=...&statut=...
GET    /api/consultations/:id
POST   /api/consultations
GET    /api/consultations/patient/:patientId
```

#### Medical Records API
```
GET    /api/dossiers-medicaux
GET    /api/dossiers-medicaux/:id
GET    /api/dossiers-medicaux/patient/:patientId
POST   /api/dossiers-medicaux
PUT    /api/dossiers-medicaux/:id
```

#### Medications API
```
GET    /api/medicaments
GET    /api/medicaments/:id
GET    /api/medicaments/search?q=...
```

#### Prescriptions API
```
GET    /api/ordonnances
GET    /api/ordonnances/:id
POST   /api/ordonnances
GET    /api/ordonnances/patient/:patientId
```

---

## Mock Data

All components include comprehensive mock data for development and testing. Replace API calls with actual endpoints when backend is ready.

### Example Mock Consultation:
```javascript
{
  id: 1,
  date: '2024-01-16',
  heure: '09:00',
  patient: {
    nom: 'Alami',
    prenom: 'Mohammed',
    cin: 'AB123456'
  },
  diagnostic: 'Grippe saisonnière...',
  duree: 30,
  statut: 'Terminée'
}
```

### Example Mock Medical Record:
```javascript
{
  id: 1,
  patientId: 1,
  antecedentsMedicaux: 'Hypertension artérielle...',
  allergies: 'Pénicilline, Pollen',
  // ... other fields
}
```

---

## Dependencies

### Required
- `react`, `react-router-dom` - Core React libraries
- `jspdf` - PDF generation (already in package.json)
- `lucide-react` - Icons
- `date-fns` - Date formatting (already in package.json)

### UI Components Used
- `DashboardLayout` - Layout wrapper
- `Card` - Card container
- `Table` - Data table
- `Badge` - Status badges
- `Button` - Action buttons
- `Input` - Form inputs
- `Modal` - Dialog modals
- `Autocomplete` - Search component

### Services Used
- `consultationService`
- `ordonnanceService`
- `medicamentService`
- `patientService`
- `dossierMedicalService` (new)

### Context
- `AuthContext` - User authentication and role

### Utils
- `toast` - Notifications

---

## Styling

All components use Tailwind CSS with consistent design system:
- Primary color: Blue (blue-600)
- Danger color: Red (red-600)
- Success color: Green (green-600)
- Warning color: Yellow (yellow-600)
- Responsive design with mobile support
- Accessible forms with proper labels

---

## Form Validation

### Consultation Form
- **Required fields:**
  - Diagnostic (textarea, cannot be empty)
  - Traitement (textarea, cannot be empty)
  - Durée (number, must be > 0)
- **Medication validation:**
  - Must select medication before adding
  - Posologie required

### Medical Record Form
- All fields optional (allows gradual documentation)
- Allergies field emphasized for safety

---

## Error Handling

All components include:
- Try-catch blocks for API calls
- Error state management
- User-friendly error messages with toast notifications
- Loading spinners
- Empty states with helpful messages

---

## Accessibility

- Proper form labels with `<label>` tags
- Required fields marked with `*`
- ARIA-compliant components
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

---

## Future Enhancements

1. **Auto-save** - Save drafts automatically
2. **Templates** - Common consultation templates
3. **Voice input** - Speech-to-text for notes
4. **Attachments** - Upload medical documents
5. **History** - Track changes to medical records
6. **Export** - Export complete medical history
7. **E-signature** - Digital signature for prescriptions
8. **Print preview** - Preview before generating PDF
9. **Multi-language** - Support for Arabic
10. **Advanced search** - Full-text search in consultations

---

## Testing Checklist

- [ ] Load consultation list
- [ ] Filter consultations by date
- [ ] Filter consultations by status
- [ ] View consultation details
- [ ] Create new consultation
- [ ] Add medications with autocomplete
- [ ] Remove medications
- [ ] Select examinations
- [ ] Generate medication prescription PDF
- [ ] Generate examination prescription PDF
- [ ] Save consultation
- [ ] Load medical record
- [ ] Create new medical record
- [ ] Edit medical record
- [ ] View medical record (embedded)
- [ ] Allergies highlighted correctly
- [ ] Form validation works
- [ ] Error handling works
- [ ] Responsive on mobile

---

## Support

For issues or questions:
1. Check mock data is properly configured
2. Verify all imports are correct
3. Ensure dependencies are installed
4. Check browser console for errors
5. Verify routing configuration

---

## License

Part of the Cabinet Medical Management System
© 2024 - All rights reserved
