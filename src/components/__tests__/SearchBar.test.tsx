import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
    it('renders input field and submit button', () => {
        render(<SearchBar onSearch={jest.fn()} isLoading={false} />);

        expect(screen.getByPlaceholderText('Enter IMDb ID (e.g., tt0133093)')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Search movie' })).toBeInTheDocument();
    });

    it('shows error when submitting empty input', () => {
        render(<SearchBar onSearch={jest.fn()} isLoading={false} />);

        const submitBtn = screen.getByRole('button', { name: 'Search movie' });
        fireEvent.click(submitBtn);

        expect(screen.getByText('Please enter an IMDb movie ID')).toBeInTheDocument();
    });

    it('shows error when submitting invalid IMDb ID', () => {
        render(<SearchBar onSearch={jest.fn()} isLoading={false} />);

        const input = screen.getByPlaceholderText('Enter IMDb ID (e.g., tt0133093)');
        fireEvent.change(input, { target: { value: 'invalid-id' } });

        const submitBtn = screen.getByRole('button', { name: 'Search movie' });
        fireEvent.click(submitBtn);

        expect(screen.getByText('Invalid format. Use format: tt followed by 5-10 digits (e.g., tt0133093)')).toBeInTheDocument();
    });

    it('calls onSearch when submitting valid format', () => {
        const mockOnSearch = jest.fn();
        render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

        const input = screen.getByPlaceholderText('Enter IMDb ID (e.g., tt0133093)');
        fireEvent.change(input, { target: { value: 'tt0133093' } });

        const submitBtn = screen.getByRole('button', { name: 'Search movie' });
        fireEvent.click(submitBtn);

        expect(mockOnSearch).toHaveBeenCalledWith('tt0133093');
    });

    it('shows loading state correctly', () => {
        render(<SearchBar onSearch={jest.fn()} isLoading={true} />);

        expect(screen.getByRole('button', { name: 'Searching...' })).toBeDisabled();
        expect(screen.getByText('Analyzing...')).toBeInTheDocument();

        const input = screen.getByPlaceholderText('Enter IMDb ID (e.g., tt0133093)');
        expect(input).toBeDisabled();
    });
});
