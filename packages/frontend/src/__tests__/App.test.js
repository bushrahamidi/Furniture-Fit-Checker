import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders the application workspace', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'DesignFit — Furniture Fit Checker' })).toBeInTheDocument();
    expect(screen.getByText('Application workspace ready for development')).toBeInTheDocument();
  });
});
