import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div style={{
      backgroundColor: '#F8F7F2',
      color: '#111827',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      <main style={{ flex: 1 }}>
        {activeView === 'landing' ? (
          <LandingPage onGoToDashboard={() => setActiveView('dashboard')} />
        ) : (
          <DashboardPage />
        )}
      </main>

      <footer style={{
        backgroundColor: '#111827',
        color: '#FFFFFF',
        fontWeight: 600,
        textAlign: 'center',
        padding: '20px',
        fontSize: '13px',
        borderTop: '3px solid #00427b'
      }}>
        ⚡ INVICTORY_AI MVP © 2026 - Hackathon Colsubsidio x 30X | Reto Hotelería (Corporate Innovation Framework)
      </footer>
    </div>
  );
}


