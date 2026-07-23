import React from 'react';
import { IconZap, IconDashboard } from './Icons.jsx';

export default function Navbar({ activeView, setActiveView }) {
  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      color: '#111827',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #c1c6d3',
      boxShadow: '0 2px 8px rgba(0, 66, 123, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Identity (docs/DESIGN .md) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          backgroundColor: '#00427b',
          color: '#FFFFFF',
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <IconZap size={22} color="#FDD000" />
        </div>
        <div>
          <div style={{
            fontSize: '20px',
            fontWeight: 900,
            color: '#00427b',
            letterSpacing: '-0.5px',
            textTransform: 'uppercase'
          }}>
            INVICTORY_AI
          </div>
          <div style={{ fontSize: '11px', color: '#727782', fontWeight: 600, textTransform: 'uppercase' }}>
            Reto Hotelería | Colsubsidio x 30X
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <nav style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setActiveView('landing')}
          className={`corporate-btn ${activeView === 'landing' ? '' : 'corporate-btn-outline'}`}
          style={{ padding: '10px 20px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <IconZap size={15} color={activeView === 'landing' ? '#FFFFFF' : '#00427b'} />
          Landing Intro
        </button>
        <button
          onClick={() => setActiveView('dashboard')}
          className={`corporate-btn ${activeView === 'dashboard' ? '' : 'corporate-btn-outline'}`}
          style={{ padding: '10px 20px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <IconDashboard size={15} color={activeView === 'dashboard' ? '#FFFFFF' : '#00427b'} />
          Dashboard MVP (Descuadres)
        </button>
      </nav>
    </header>
  );
}
