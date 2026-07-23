import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BentoGridKPI from '../components/BentoGridKPI.jsx';

describe('BentoGridKPI Component', () => {
  const mockSummary = {
    total_skus: 12,
    total_bodegas: 4,
    total_conteos_ia: 3,
    total_descuadres: 3,
    porcentaje_precision: 75.0,
    items_descuadrados: []
  };

  it('debe renderizar correctamente los KPIs principales del inventario', () => {
    render(<BentoGridKPI summary={mockSummary} />);

    expect(screen.getByText('SKUS EN ERP (SISTEMA)')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('CONTEOS PROCESADOS IA')).toBeInTheDocument();
    expect(screen.getByText('DESCUADRES DETECTADOS')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('debe mostrar mensaje de atención cuando existen descuadres', () => {
    render(<BentoGridKPI summary={mockSummary} />);
    expect(screen.getByText('¡Requiere auditoría antes de guardar!')).toBeInTheDocument();
  });

  it('no debe romperse si summary es null', () => {
    const { container } = render(<BentoGridKPI summary={null} />);
    expect(container.firstChild).toBeNull();
  });
});
