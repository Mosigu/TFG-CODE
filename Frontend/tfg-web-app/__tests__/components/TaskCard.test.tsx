import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../../app/components/TaskCard';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Radix UI components
jest.mock('@radix-ui/themes', () => ({
  Card: ({ children, onClick, onMouseEnter, onMouseLeave, style, variant }: any) => (
    <div
      data-testid="task-card"
      data-variant={variant}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  ),
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Heading: ({ children, size, weight }: { children: React.ReactNode; size?: string; weight?: string }) => (
    <h2 data-size={size} data-weight={weight}>{children}</h2>
  ),
  Text: ({ children, size, color }: { children: React.ReactNode; size?: string; color?: string }) => (
    <span data-size={size} data-color={color}>{children}</span>
  ),
  Badge: ({ children, color, size }: { children: React.ReactNode; color?: string; size?: string }) => (
    <span data-testid="priority-badge" data-color={color} data-size={size}>{children}</span>
  ),
}));

// Mock Radix Icons
jest.mock('@radix-ui/react-icons', () => ({
  CalendarIcon: () => <span data-testid="calendar-icon" />,
}));

describe('TaskCard', () => {
  const defaultProps = {
    id: 'task-1',
    title: 'Test Task',
    priority: 'high',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders task title correctly', () => {
    render(<TaskCard {...defaultProps} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('renders priority badge', () => {
    render(<TaskCard {...defaultProps} />);

    const badge = screen.getByTestId('priority-badge');
    expect(badge).toHaveTextContent('high');
    expect(badge).toHaveAttribute('data-color', 'red');
  });

  it('renders dates correctly', () => {
    render(<TaskCard {...defaultProps} />);

    expect(screen.getByText(/2024-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/2024-01-31/)).toBeInTheDocument();
  });

  it('renders project title when provided', () => {
    render(<TaskCard {...defaultProps} projectTitle="My Project" />);

    expect(screen.getByText('My Project')).toBeInTheDocument();
  });

  it('does not render project title when not provided', () => {
    render(<TaskCard {...defaultProps} />);

    expect(screen.queryByText('My Project')).not.toBeInTheDocument();
  });

  it('navigates to task detail on click', () => {
    render(<TaskCard {...defaultProps} />);

    const card = screen.getByTestId('task-card');
    fireEvent.click(card);

    expect(mockPush).toHaveBeenCalledWith('/tasks/task-1');
  });

  it('applies correct priority color for medium priority', () => {
    render(<TaskCard {...defaultProps} priority="medium" />);

    const badge = screen.getByTestId('priority-badge');
    expect(badge).toHaveAttribute('data-color', 'orange');
  });

  it('applies correct priority color for low priority', () => {
    render(<TaskCard {...defaultProps} priority="low" />);

    const badge = screen.getByTestId('priority-badge');
    expect(badge).toHaveAttribute('data-color', 'green');
  });

  it('applies gray color for unknown priority', () => {
    render(<TaskCard {...defaultProps} priority="unknown" />);

    const badge = screen.getByTestId('priority-badge');
    expect(badge).toHaveAttribute('data-color', 'gray');
  });

  it('renders calendar icon', () => {
    render(<TaskCard {...defaultProps} />);

    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
  });
});
