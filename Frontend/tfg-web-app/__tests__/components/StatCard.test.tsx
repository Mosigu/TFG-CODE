import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../../app/components/StatCard';

// Mock Radix UI components
jest.mock('@radix-ui/themes', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  Flex: ({ children, direction, gap, justify, align, p }: { children: React.ReactNode; direction?: string; gap?: string; justify?: string; align?: string; p?: string }) => (
    <div data-testid="flex" data-direction={direction} data-gap={gap} data-justify={justify} data-align={align} data-p={p}>{children}</div>
  ),
  Text: ({ children, size, weight, className }: { children: React.ReactNode; size?: string; weight?: string; className?: string }) => (
    <span data-testid="text" data-size={size} data-weight={weight} className={className}>{children}</span>
  ),
  Box: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="box" className={className}>{children}</div>
  ),
}));

describe('StatCard', () => {
  it('renders title and value correctly', () => {
    render(<StatCard title="Total Projects" value={42} />);

    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders with string value', () => {
    render(<StatCard title="Status" value="Active" />);

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const icon = <span data-testid="test-icon">Icon</span>;
    render(<StatCard title="Test" value={10} icon={icon} />);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders positive trend correctly', () => {
    render(
      <StatCard
        title="Growth"
        value={100}
        trend={{ value: '15%', isPositive: true }}
      />
    );

    expect(screen.getByText(/↑/)).toBeInTheDocument();
    expect(screen.getByText(/15%/)).toBeInTheDocument();
  });

  it('renders negative trend correctly', () => {
    render(
      <StatCard
        title="Decline"
        value={50}
        trend={{ value: '10%', isPositive: false }}
      />
    );

    expect(screen.getByText(/↓/)).toBeInTheDocument();
    expect(screen.getByText(/10%/)).toBeInTheDocument();
  });

  it('applies correct color class', () => {
    render(<StatCard title="Test" value={1} color="green" />);

    const card = screen.getByTestId('card');
    expect(card.className).toContain('green');
  });

  it('uses default iris color when no color specified', () => {
    render(<StatCard title="Test" value={1} />);

    const card = screen.getByTestId('card');
    expect(card.className).toContain('iris');
  });
});
