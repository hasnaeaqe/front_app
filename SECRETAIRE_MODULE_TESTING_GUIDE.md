# Testing Guide - Secretaire Module

## Prerequisites

### Backend Setup
1. Ensure PostgreSQL database is running
2. Database should have sample data for testing
3. Backend application should be running on port 8080

```bash
cd backend
mvn spring-boot:run
```

### Frontend Setup
1. Dependencies should be installed
2. Frontend should be running on port 3000

```bash
npm install
npm start
```

## Test Scenarios

### 1. Dashboard Statistics Test

**Objective:** Verify that dashboard displays real statistics from database

**Steps:**
1. Login as SECRETAIRE user
2. Navigate to `/secretaire/dashboard`
3. Verify the following statistics cards display real numbers:
   - **Patients Total**: Should match count in `patient` table
   - **RDV Aujourd'hui**: Should match count of today's appointments in `rendez_vous` table
   - **Factures en Attente**: Should match count where `statut_paiement = 'EN_ATTENTE'`
   - **Revenu Total**: Should display sum of paid invoices for current month

**Expected Result:**
- All statistics should display real numbers from database
- Numbers should update when database changes

**API Endpoint:** `GET /api/secretaire/stats`

**Test Query:**
```sql
-- Verify patients total
SELECT COUNT(*) FROM patient;

-- Verify today's appointments
SELECT COUNT(*) FROM rendez_vous WHERE date_rdv = CURRENT_DATE;

-- Verify pending invoices
SELECT COUNT(*) FROM facture WHERE statut_paiement = 'EN_ATTENTE';

-- Verify revenue this month
SELECT SUM(montant) FROM facture 
WHERE statut_paiement = 'PAYE' 
AND DATE_TRUNC('month', date_emission) = DATE_TRUNC('month', CURRENT_DATE);
```

### 2. Today's Appointments Display Test

**Objective:** Verify that today's appointments display with correct data

**Steps:**
1. On dashboard, scroll to "Prochains Rendez-vous" section
2. Verify appointments are displayed with:
   - Time (HH:MM format)
   - Doctor name
   - Patient name
   - Time remaining (dynamic calculation)

**Expected Result:**
- List shows up to 5 appointments for today
- Times are sorted chronologically
- "Time remaining" updates dynamically
- Shows "Aucun rendez-vous aujourd'hui" if no appointments

**API Endpoint:** `GET /api/secretaire/rendez-vous/aujourdhui`

**Test Query:**
```sql
-- Verify today's appointments
SELECT rv.*, p.nom as patient_nom, p.prenom as patient_prenom,
       u.nom as medecin_nom, u.prenom as medecin_prenom
FROM rendez_vous rv
JOIN patient p ON rv.patient_id = p.id
JOIN utilisateur u ON rv.medecin_id = u.id
WHERE rv.date_rdv = CURRENT_DATE
ORDER BY rv.heure_rdv ASC;
```

### 3. Patient Management Test

**Objective:** Verify patient CRUD operations work correctly

**Steps:**
1. Navigate to `/secretaire/patients`
2. **List Test:**
   - Verify all patients are displayed
   - Check pagination works
3. **Search Test:**
   - Search by name
   - Search by CIN
   - Verify results are filtered correctly
4. **Create Test:**
   - Click "Nouveau Patient"
   - Fill form with valid data
   - Submit and verify patient is added
5. **Edit Test:**
   - Click edit on a patient
   - Modify information
   - Save and verify changes
6. **Delete Test:**
   - Delete a test patient
   - Confirm deletion
   - Verify patient is removed

**Expected Result:**
- All operations complete successfully
- Database is updated correctly
- Toast notifications show success/error messages

**API Endpoints:**
- `GET /api/patients` - List all
- `POST /api/patients` - Create
- `PUT /api/patients/{id}` - Update
- `DELETE /api/patients/{id}` - Delete

### 4. Invoice Management Test

**Objective:** Verify complete invoice functionality

#### 4.1 List and Filter Test

**Steps:**
1. Navigate to `/secretaire/facturation`
2. Verify statistics cards display:
   - Total pending invoices
   - Total paid this month
   - Amount pending
   - Amount collected this month
3. Verify invoice list displays all invoices
4. Test status filter:
   - Select "En attente" - should show only unpaid
   - Select "Payées" - should show only paid
   - Select "Toutes" - should show all
5. Test search:
   - Search by invoice number
   - Search by patient name

**Expected Result:**
- Statistics match database
- Filters work correctly
- Search returns relevant results

**API Endpoints:**
- `GET /api/factures` - All invoices
- `GET /api/factures?statut=EN_ATTENTE` - Filter by status
- `GET /api/factures/stats` - Statistics

#### 4.2 Create Invoice Test

**Steps:**
1. Click "Nouvelle Facture"
2. Fill form:
   - Select patient
   - Enter amount (e.g., 500.00)
   - Optional: Enter due date
   - Optional: Enter notes
3. Submit form

**Expected Result:**
- Invoice is created in database
- Unique invoice number is generated
- Status is set to "EN_ATTENTE"
- Invoice appears in list
- Success toast notification

**API Endpoint:** `POST /api/factures`

**Test Query:**
```sql
-- Verify invoice was created
SELECT * FROM facture 
ORDER BY date_emission DESC 
LIMIT 1;
```

#### 4.3 Pay Invoice Test

**Steps:**
1. Find an invoice with status "EN_ATTENTE"
2. Click the green checkmark button
3. Confirm payment in modal
4. Verify status changes to "PAYE"
5. Verify `date_paiement` is set to now

**Expected Result:**
- Status changes to "PAYE"
- Payment date is recorded
- Statistics are updated
- Success toast notification

**API Endpoint:** `PUT /api/factures/{id}/payer`

**Test Query:**
```sql
-- Verify payment was recorded
SELECT id, numero, montant, statut_paiement, date_paiement 
FROM facture 
WHERE id = [invoice_id];
```

#### 4.4 Print Invoice Test

**Steps:**
1. Click printer icon on any invoice
2. Verify print preview opens in new window
3. Check that invoice contains:
   - Invoice number
   - Patient information (name, CIN)
   - Emission date
   - Status
   - Amount
   - Description

**Expected Result:**
- Print window opens
- All data is displayed correctly
- No XSS vulnerabilities (special characters are sanitized)

### 5. Integration Tests

**Objective:** Test end-to-end workflow

#### Scenario: New Patient Visit and Invoice

**Steps:**
1. Create a new patient
2. Create a rendez-vous for today for that patient
3. Verify appointment appears in dashboard
4. Create an invoice for the patient
5. Verify invoice appears in facturation page
6. Mark invoice as paid
7. Verify statistics update

**Expected Result:**
- Complete workflow works seamlessly
- All data is consistent across pages
- Statistics update in real-time

### 6. Error Handling Tests

**Objective:** Verify proper error handling

**Tests:**
1. **Network Error:** Stop backend, try to load dashboard
   - Should show error message
   - Should not crash
2. **Invalid Data:** Try to create invoice with negative amount
   - Should show validation error
3. **Not Found:** Try to access non-existent patient
   - Should show error message

**Expected Result:**
- Appropriate error messages displayed
- Application remains stable
- Toast notifications inform user

### 7. Performance Tests

**Objective:** Verify application handles large datasets

**Tests:**
1. Test with 100+ patients
2. Test with 50+ invoices
3. Verify pagination works
4. Verify search is responsive

**Expected Result:**
- Pages load within 2 seconds
- No UI freezing
- Smooth scrolling and pagination

## Database Seed Data (Optional)

For comprehensive testing, you may want to seed the database:

```sql
-- Insert test patients
INSERT INTO patient (cin, nom, prenom, date_naissance, sexe, num_tel, email, adresse, type_mutuelle)
VALUES 
  ('AB123456', 'Test', 'Patient1', '1990-01-01', 'M', '0612345678', 'test1@email.com', '123 Rue Test', 'CNOPS'),
  ('CD789012', 'Test', 'Patient2', '1985-05-15', 'F', '0687654321', 'test2@email.com', '456 Rue Test', 'CNSS');

-- Insert test appointments for today
INSERT INTO rendez_vous (patient_id, medecin_id, date_rdv, heure_rdv, motif, statut)
SELECT 
  (SELECT id FROM patient LIMIT 1),
  (SELECT id FROM utilisateur WHERE role = 'MEDECIN' LIMIT 1),
  CURRENT_DATE,
  '10:00:00',
  'Consultation générale',
  'EN_ATTENTE';

-- Insert test invoices
INSERT INTO facture (numero, patient_id, montant, statut_paiement, date_emission)
SELECT 
  'FACT-TEST-001',
  (SELECT id FROM patient LIMIT 1),
  500.00,
  'EN_ATTENTE',
  CURRENT_TIMESTAMP;
```

## Automated Test Commands

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
npm test
```

### Build Tests
```bash
# Backend
cd backend
mvn clean compile

# Frontend
npm run build
```

## Checklist

- [ ] Dashboard displays real statistics
- [ ] Today's appointments show correctly
- [ ] Patient CRUD operations work
- [ ] Invoice list displays from database
- [ ] Invoice filters work
- [ ] Invoice search works
- [ ] Create invoice works
- [ ] Pay invoice works
- [ ] Print invoice works
- [ ] Error handling is appropriate
- [ ] Performance is acceptable
- [ ] Build completes without errors
- [ ] No console errors in browser
- [ ] Toast notifications work

## Common Issues and Solutions

### Issue: "Cannot connect to backend"
**Solution:** Ensure backend is running on http://localhost:8080

### Issue: "Statistics show 0"
**Solution:** Check database has data, verify queries in service

### Issue: "Print doesn't work"
**Solution:** Check browser popup blocker settings

### Issue: "Search returns nothing"
**Solution:** Verify data exists, check search query in service

## Security Verification

- [ ] XSS protection in print function works
- [ ] Input validation prevents invalid data
- [ ] API requires authentication
- [ ] CORS is properly configured
- [ ] SQL injection protection (use parameterized queries)

## Conclusion

This testing guide covers all major functionality of the Secretaire module. Complete all tests to ensure the implementation is production-ready.
