import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Navbar from '../components/Navbar.jsx';

describe('Navbar Component', () => {
  it('debe renderizar el título de la marca INVICTORY_AI', () => {
    render(<Navbar activeView="dashboard" setActiveView={vi.fn()} />);

    expect(screen.getByText('INVICTORY_AI')).toBeInTheDocument();
    expect(screen.getByText('Reto Hotelería | Colsubsidio x 30X')).toBeInTheDocument();
  });

  it('debe cambiar de vista al hacer clic en los botones de navegación', () => {
    const setActiveViewMock = vi.fn();
    render(<Navbar activeView="dashboard" setActiveView={setActiveViewMock} />);

    const landingBtn = screen.getByRole('button', { name: /Landing Intro/i });
    fireEvent.click(landingBtn);

    expect(setActiveViewMock).toHaveBeenCalledWith('landing');
  });
});
