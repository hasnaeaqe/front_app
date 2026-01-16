# Patient Management Pages

## Overview
Comprehensive patient management system for the medical cabinet application with three main pages:
- **PatientList**: Full patient listing with search, create, edit, and delete functionality
- **PatientProfile**: Detailed patient profile with medical history, consultations, prescriptions, invoices, and documents
- **RecherchePatients**: Fast patient search interface for doctors

## Files Created

### 1. `/src/pages/Patients/PatientList.js`
Full-featured patient list management page.

**Features:**
- Search by name or CIN
- Create/Edit patients with validation
- Delete with confirmation
- Send patient to doctor (secretaire only)
- View patient profile
- Pagination
- Responsive design

**API Endpoints:**
- `GET /api/patients` - Fetch all patients
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search?query=...` - Search patients
- `POST /api/patients/:id/send-to-medecin` - Send to doctor

**State Management:**
- Patient list with filtering
- Modal for create/edit
- Form validation
- Loading/error states
- Search functionality

### 2. `/src/pages/Patients/PatientProfile.js`
Comprehensive patient profile with tabbed interface.

**Features:**
- Patient header with photo placeholder, contact info, and mutuelle
- Role-based action buttons
- 5 tabs: Dossier Médical, Consultations, Ordonnances, Factures, Documents
- Age calculation
- Status badges
- Download/view functionality for documents

**API Endpoints:**
- `GET /api/patients/:id` - Patient details
- `GET /api/dossiers-medicaux/patient/:id` - Medical history
- `GET /api/consultations/patient/:id` - Consultations
- `GET /api/ordonnances/patient/:id` - Prescriptions
- `GET /api/factures/patient/:id` - Invoices
- `GET /api/documents/patient/:id` - Documents

**Tabs:**
1. **Dossier Médical**: Medical/surgical history, allergies, habits, current diagnosis
2. **Consultations**: History with date, doctor, diagnosis, treatment
3. **Ordonnances**: Prescriptions with download PDF
4. **Factures**: Invoices with status badges
5. **Documents**: Medical documents with upload/download

### 3. `/src/pages/Patients/RecherchePatients.js`
Doctor-focused patient search interface.

**Features:**
- Large search interface with radio buttons
- Search by name or CIN
- Patient cards with key info
- Quick actions: View profile, New consultation
- Last consultation date display
- Responsive grid layout

**API Endpoints:**
- `GET /api/patients/search?query=...` - Search patients

## Service Updates

### `/src/services/patientService.js`
Added `sendToDoctor` method:
```javascript
sendToDoctor: (id) => api.post(`/patients/${id}/send-to-medecin`)
```

## Components Used

### UI Components
- `DashboardLayout` - Main layout wrapper
- `Card` - Content containers with colored borders
- `Button` - Action buttons with variants
- `Table` - Data table with pagination
- `Badge` - Status indicators
- `Modal` - Dialog windows
- `Input` - Form inputs with validation

### Icons (lucide-react)
- Search, Plus, Eye, Edit, Send, Trash2
- Phone, Mail, MapPin, Calendar
- User, Heart, FileText, Pill, Receipt, File
- Loader, Download, Upload

### Context
- `useAuth` - User authentication and role

### Routing
- `useNavigate`, `useParams` from react-router-dom

## User Roles

### SECRETAIRE
- Can view, create, edit, delete patients
- Can send patients to doctor
- Can create appointments
- Access via: `/secretaire/patients`

### MEDECIN
- Can search patients
- Can view patient profiles
- Can create consultations
- Can view medical history
- Access via: `/medecin/patients`

## Form Validation

### Patient Form
- **CIN**: Required
- **Nom**: Required
- **Prénom**: Required
- **Date de naissance**: Required
- **Téléphone**: Required, format: 05/06/07 + 8 digits
- **Email**: Optional, valid email format
- **Sexe**: M/F selection
- **Type Mutuelle**: CNOPS, CNSS, RAMED, PRIVEE, AUCUNE

## Sample Data

All pages include sample data for development/testing when API calls fail.

**Sample Patient:**
```javascript
{
  id: 1,
  cin: 'AB123456',
  nom: 'Alami',
  prenom: 'Mohammed',
  dateNaissance: '1985-03-15',
  sexe: 'M',
  telephone: '0612345678',
  email: 'mohammed.alami@email.com',
  adresse: '123 Rue de Casablanca',
  typeMutuelle: 'CNOPS'
}
```

## Responsive Design

All pages are fully responsive:
- Mobile: Single column layout
- Tablet: 2-column grids
- Desktop: Full 3-column grids

## Accessibility

- ARIA labels on buttons
- Keyboard navigation support
- Focus management in modals
- Semantic HTML
- Screen reader friendly

## Error Handling

- Try-catch blocks for all API calls
- Loading states with spinners
- Error messages
- Fallback to sample data
- Toast notifications (alerts)

## Future Enhancements

1. **Advanced Search**: Multiple filters, date ranges
2. **Export**: CSV/PDF export of patient list
3. **Bulk Operations**: Multi-select and bulk actions
4. **Statistics**: Patient demographics dashboard
5. **Document Preview**: In-app document viewer
6. **Photo Upload**: Patient photo management
7. **Print**: Print patient profiles
8. **History Tracking**: Audit log of changes

## Usage Examples

### Import in Routes
```javascript
import { PatientList, PatientProfile, RecherchePatients } from './pages/Patients';

// In routes
<Route path="/secretaire/patients" element={<PatientList />} />
<Route path="/secretaire/patients/:id" element={<PatientProfile />} />
<Route path="/medecin/patients/:id" element={<PatientProfile />} />
<Route path="/medecin/recherche-patients" element={<RecherchePatients />} />
```

### Navigation
```javascript
// View patient profile
navigate(`/secretaire/patients/${patientId}`);

// New consultation with patient
navigate(`/medecin/consultations/nouvelle/${patientId}`);

// New appointment with patient
navigate(`/secretaire/rendez-vous/nouveau?patientId=${patientId}`);
```

## Testing

All components include:
- Sample data for offline development
- Console logging for debugging
- Error boundary compatibility
- PropTypes validation (via component usage)

## Styling

- Tailwind CSS utility classes
- Consistent color scheme (violet/purple primary)
- Hover effects and transitions
- Shadow and border styling
- Responsive spacing

## Performance

- Efficient filtering with useMemo potential
- Pagination for large datasets
- Lazy loading tabs
- Optimized re-renders
- Proper key usage in lists
