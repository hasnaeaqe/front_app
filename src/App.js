import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import PatientList from './components/PatientList';
import authService from './services/authService';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <h1 style={styles.navTitle}>Cabinet Médical</h1>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Déconnexion
          </button>
        </div>
      </nav>
      <main style={styles.main}>
        <PatientList user={user} />
      </main>
      <footer style={styles.footer}>
        <p>© 2024 Cabinet Médical - Système de Gestion</p>
      </footer>
    </div>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '15px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navTitle: {
    margin: 0,
    fontSize: '24px'
  },
  logoutButton: {
    padding: '8px 20px',
    backgroundColor: 'white',
    color: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  main: {
    minHeight: 'calc(100vh - 140px)',
    backgroundColor: '#f5f5f5'
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    fontSize: '14px'
  }
};

export default App;
