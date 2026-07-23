import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import LandingPage from '../pages/LandingPage.jsx';

describe('LandingPage Component', () => {
  it('debe renderizar correctamente la landing page sin pantalla en blanco ni errores', () => {
    render(<LandingPage onGoToDashboard={() => {}} />);
    expect(screen.getByText(/Toma de inventarios en minutos/i)).toBeInTheDocument();
    expect(screen.getByText(/Diseñado para la Escala/i)).toBeInTheDocument();
  });
});

