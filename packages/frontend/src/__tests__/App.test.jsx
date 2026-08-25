import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

describe('App Component', () => {
  test('renders the room and furniture forms with the check fit action', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'DesignFit' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Room Information' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Furniture Information' })).toBeInTheDocument();
    expect(screen.getByLabelText('Room Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Furniture Type')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check Fit' })).toBeInTheDocument();
  });

  test('shows validation errors when submitting an empty form', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: 'Check Fit' }));

    expect(await screen.findByText('Room name is required.')).toBeInTheDocument();
    expect(screen.getByText('Furniture name is required.')).toBeInTheDocument();
  });
});