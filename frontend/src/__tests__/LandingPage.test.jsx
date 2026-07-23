import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import LandingPage from '../pages/LandingPage.jsx';

describe('LandingPage Component', () => {
  it('debe renderizar correctamente la landing page sin pantalla en blanco ni errores', () => {
    render(<LandingPage onGoToDashboard={() => {}} />);
    expect(screen.getByText(/Captura Inteligente de Inventarios/i)).toBeInTheDocument();
    expect(screen.getByText(/Enfoques de Diseño Stitch/i)).toBeInTheDocument();
  });
});
