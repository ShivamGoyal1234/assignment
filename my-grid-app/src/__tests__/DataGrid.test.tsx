import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { api } from '../services/api';
import { DataGrid } from '../components/DataGrid';

// Mock the API
jest.mock('../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

const mockData = [
  {
    _id: '1',
    location: 'New York',
    potentialRevenue: { value: 100000, percentage: 25 },
    competitorProcessingVolume: { value: 500000, percentage: 30 },
    competitorMerchant: 150,
    revenuePerAccount: 2500,
    marketShareByRevenue: 15,
    commercialDDAs: 1000
  },
  {
    _id: '2',
    location: 'Los Angeles',
    potentialRevenue: { value: 150000, percentage: 35 },
    competitorProcessingVolume: { value: 600000, percentage: 40 },
    competitorMerchant: 200,
    revenuePerAccount: 3000,
    marketShareByRevenue: 20,
    commercialDDAs: 1500
  }
];

describe('DataGrid Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi.getData.mockResolvedValue(mockData);
  });

  test('renders DataGrid component and fetches initial data', async () => {
    render(<DataGrid />);
    
    expect(mockedApi.getData).toHaveBeenCalledWith('location', undefined);
    
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
      expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    });
  });

  test('handles view change correctly', async () => {
    render(<DataGrid />);
    
    const viewSelect = screen.getByRole('combobox');
    fireEvent.change(viewSelect, { target: { value: 'branch' } });
    
    expect(mockedApi.getData).toHaveBeenCalledWith('branch', undefined);
  });

  test('handles sorting correctly', async () => {
    render(<DataGrid />);
    
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    const locationHeader = screen.getByText(/Location/);
    fireEvent.click(locationHeader);

    const rows = screen.getAllByRole('row');
    const cells = rows[2].querySelectorAll('td'); // First row after header and totals
    expect(cells[0].textContent).toBe('Los Angeles');
  });

  test('handles pagination correctly', async () => {
    const manyItems = Array.from({ length: 7 }, (_, i) => ({
      ...mockData[0],
      _id: String(i),
      location: `Location ${i}`
    }));
    
    mockedApi.getData.mockResolvedValue(manyItems);
    
    render(<DataGrid />);
    
    await waitFor(() => {
      expect(screen.getByText('Location 0')).toBeInTheDocument();
    });

    expect(screen.getByText('Showing 1 to 5 of 7 entries')).toBeInTheDocument();

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(screen.getByText('Location 5')).toBeInTheDocument();
  });

  test('handles row deletion correctly', async () => {
    
    render(<DataGrid />);
    
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('×');
    fireEvent.click(deleteButtons[0]);

    expect(mockedApi.deleteRow).toHaveBeenCalledWith('1');
    
    expect(mockedApi.getData).toHaveBeenCalledTimes(2);
  });

  test('calculates totals correctly', async () => {
    render(<DataGrid />);
    
    await waitFor(() => {
      expect(screen.getByText('250000')).toBeInTheDocument(); // Total potential revenue
      expect(screen.getByText('1100000')).toBeInTheDocument(); // Total competitor processing volume
      expect(screen.getByText('350')).toBeInTheDocument(); // Total competitor merchant
      expect(screen.getByText('2500')).toBeInTheDocument(); // Total revenue per account
    });
  });
});