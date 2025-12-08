import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../app/login/page';
import { loginUser } from '../../app/utils/work-element-utils';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock loginUser
jest.mock('../../app/utils/work-element-utils', () => ({
  loginUser: jest.fn(),
}));

// Mock Radix UI components
jest.mock('@radix-ui/themes', () => ({
  Flex: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Heading: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  Text: ({ children, color, ...props }: any) => (
    <span data-color={color} {...props}>{children}</span>
  ),
  TextField: {
    Root: ({ type, placeholder, value, onChange, required, size, ...props }: any) => (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        data-size={size}
        {...props}
      />
    ),
  },
  Button: ({ children, type, disabled, ...props }: any) => (
    <button type={type} disabled={disabled} {...props}>{children}</button>
  ),
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<LoginPage />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your.email@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('updates email input on change', () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('your.email@example.com');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('updates password input on change', () => {
    render(<LoginPage />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput).toHaveValue('password123');
  });

  it('calls loginUser and redirects on successful login', async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      access_token: 'token',
      user: { id: '1', email: 'test@example.com' },
    });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('your.email@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message on login failure', async () => {
    (loginUser as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('your.email@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('shows loading state while logging in', async () => {
    (loginUser as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('your.email@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled();
  });

  it('displays default error message when error has no message', async () => {
    (loginUser as jest.Mock).mockRejectedValue({});

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('your.email@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to login. Please check your credentials.')).toBeInTheDocument();
    });
  });
});
