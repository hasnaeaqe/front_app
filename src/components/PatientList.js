import React, { useState, useEffect } from 'react';
import patientService from '../services/patientService';

function PatientList({ user }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await patientService.getAll();
      setPatients(response.data);
      setError('');
    } catch (err) {
      console.error('Error loading patients:', err);
      setError('Erreur lors du chargement des patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPatients();
      return;
    }

    try {
      setLoading(true);
      const response = await patientService.search(searchQuery);
      setPatients(response.data);
      setError('');
    } catch (err) {
      console.error('Error searching patients:', err);
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Liste des Patients</h2>
        <p style={styles.welcome}>Bienvenue, {user.prenom} {user.nom} ({user.role})</p>
      </div>

      <div style={styles.searchBar}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Rechercher un patient (nom ou prénom)..."
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          Rechercher
        </button>
        <button onClick={loadPatients} style={styles.refreshButton}>
          Actualiser
        </button>
      </div>

      {loading && <p style={styles.loading}>Chargement...</p>}
      {error && <div style={styles.error}>{error}</div>}

      {!loading && !error && (
        <div style={styles.tableContainer}>
          <p style={styles.count}>Total: {patients.length} patient(s)</p>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>CIN</th>
                <th style={styles.th}>Nom</th>
                <th style={styles.th}>Prénom</th>
                <th style={styles.th}>Date de Naissance</th>
                <th style={styles.th}>Sexe</th>
                <th style={styles.th}>Téléphone</th>
                <th style={styles.th}>Mutuelle</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} style={styles.tableRow}>
                  <td style={styles.td}>{patient.cin}</td>
                  <td style={styles.td}>{patient.nom}</td>
                  <td style={styles.td}>{patient.prenom}</td>
                  <td style={styles.td}>{new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}</td>
                  <td style={styles.td}>{patient.sexe}</td>
                  <td style={styles.td}>{patient.numTel}</td>
                  <td style={styles.td}>{patient.typeMutuelle}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {patients.length === 0 && (
            <p style={styles.noData}>Aucun patient trouvé</p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '30px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '15px'
  },
  title: {
    color: '#333',
    fontSize: '28px',
    marginBottom: '10px'
  },
  welcome: {
    color: '#666',
    fontSize: '14px'
  },
  searchBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  searchButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '16px',
    color: '#666'
  },
  error: {
    padding: '12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  count: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    margin: 0,
    fontWeight: 'bold',
    color: '#555'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    backgroundColor: '#007bff',
    color: 'white'
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  tableRow: {
    borderBottom: '1px solid #ddd'
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#333'
  },
  noData: {
    textAlign: 'center',
    padding: '30px',
    color: '#999',
    fontSize: '16px'
  }
};

export default PatientList;
