import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DiscrepancyTable from '../components/DiscrepancyTable.jsx';

describe('DiscrepancyTable Component', () => {
  const mockItems = [
    {
      sku: "95026919",
      articulo: "Cazuela 16 Onz",
      unidad: "Unidad",
      bodega: "Stock Almacén Suministros",
      cantidad_sistema: 10.0,
      cantidad_fisica: 15.0,
      diferencia: 5.0,
      estado: "SOBRANTE",
      alerta_prioridad: "MEDIA",
      ultima_fuente: "audio",
      observaciones: "Conteo por voz"
    },
    {
      sku: "7290",
      articulo: "Aceite Vegetal",
      unidad: "Liter",
      bodega: "Stock Restaurante Fuentes AYB",
      cantidad_sistema: 851.43,
      cantidad_fisica: 800.0,
      diferencia: -51.43,
      estado: "FALTANTE",
      alerta_prioridad: "ALTA",
      ultima_fuente: "audio",
      observaciones: "Faltante detectado"
    }
  ];

  it('debe renderizar la tabla con los artículos de inventario', () => {
    render(
      <DiscrepancyTable
        items={mockItems}
        filterStatus="ALL"
        setFilterStatus={vi.fn()}
      />
    );

    expect(screen.getByText('Cazuela 16 Onz')).toBeInTheDocument();
    expect(screen.getByText('Aceite Vegetal')).toBeInTheDocument();
    expect(screen.getAllByText('SOBRANTE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('FALTANTE').length).toBeGreaterThan(0);
  });

  it('debe llamar a setFilterStatus al hacer clic en los filtros de la tabla', () => {
    const setFilterMock = vi.fn();
    render(
      <DiscrepancyTable
        items={mockItems}
        filterStatus="ALL"
        setFilterStatus={setFilterMock}
      />
    );

    const btnFaltante = screen.getByRole('button', { name: 'FALTANTE' });
    fireEvent.click(btnFaltante);

    expect(setFilterMock).toHaveBeenCalledWith('FALTANTE');
  });
});
