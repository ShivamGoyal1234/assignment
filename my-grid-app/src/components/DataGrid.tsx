// client/src/components/DataGrid.tsx
import React, { useState, useEffect } from 'react';
import { DataRow } from '../types/data.types';
import { formatCurrency } from '../utils/formatters';
import { api } from '../services/api';

export const DataGrid: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [view, setView] = useState<'location' | 'branch'>('location');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DataRow;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, [view, selectedLocation]);

  const fetchData = async () => {
    try {
      const result = await api.getData(view, selectedLocation || undefined);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSort = (key: keyof DataRow) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    const sortedData = [...data].sort((a, b) => {
      let compareA, compareB;

      // Handle nested objects (like potentialRevenue)
      if (typeof a[key] === 'object' && a[key] !== null && 'value' in (a[key] as any)) {
        compareA = (a[key] as any).value;
        compareB = (b[key] as any).value;
      } else {
        compareA = a[key];
        compareB = b[key];
      }

      // Handle numeric comparisons
      if (typeof compareA === 'number' && typeof compareB === 'number') {
        return direction === 'asc' ? compareA - compareB : compareB - compareA;
      }

      // Handle string comparisons
      const stringA = String(compareA).toLowerCase();
      const stringB = String(compareB).toLowerCase();
      return direction === 'asc' ? stringA.localeCompare(stringB) : stringB.localeCompare(stringA);
    });
    
    setData(sortedData);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteRow(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  const calculateTotal = (key: keyof DataRow): number => {
    return data.reduce((sum, row) => {
      if (typeof row[key] === 'object' && row[key] !== null && 'value' in (row[key] as any)) {
        return sum + (row[key] as any).value;
      }
      if (typeof row[key] === 'number') {
        return sum + (row[key] as number);
      }
      return sum;
    }, 0);
  };

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="mb-6 flex justify-between items-center">
        <select
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={view}
          onChange={(e) => {
            setView(e.target.value as 'location' | 'branch');
            setSelectedLocation(null);
          }}
        >
          <option value="location">Location View</option>
          <option value="branch">Branch View</option>
        </select>
        {selectedLocation && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => setSelectedLocation(null)}
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th 
                className="border-b px-6 py-3 text-left cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('location')}
              >
                Location {sortConfig?.key === 'location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="border-b px-6 py-3 text-left cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('potentialRevenue')}
              >
                Potential Revenue
              </th>
              <th 
                className="border-b px-6 py-3 text-left cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('competitorProcessingVolume')}
              >
                Competitor Processing Volume
              </th>
              <th 
                className="border-b px-6 py-3 text-left cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('competitorMerchant')}
              >
                Competitor Merchant
              </th>
              <th 
                className="border-b px-6 py-3 text-left cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('revenuePerAccount')}
              >
                Revenue/Account
              </th>
              <th 
                className="border-b px-6 py-3 text-left cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('marketShareByRevenue')}
              >
                Market Share
              </th>
              <th 
                className="border-b px-6 py-3 text-left cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('commercialDDAs')}
              >
                Commercial DDAs
              </th>
              <th className="border-b px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Total Row */}
            <tr className="bg-gray-50">
              <td className="px-6 py-4 font-medium">Total</td>
              <td className="px-6 py-4">{formatCurrency(calculateTotal('potentialRevenue'))}</td>
              <td className="px-6 py-4">{formatCurrency(calculateTotal('competitorProcessingVolume'))}</td>
              <td className="px-6 py-4">{calculateTotal('competitorMerchant')}</td>
              <td className="px-6 py-4">{formatCurrency(calculateTotal('revenuePerAccount'))}</td>
              <td className="px-6 py-4">{calculateTotal('marketShareByRevenue')}%</td>
              <td className="px-6 py-4">{calculateTotal('commercialDDAs')}</td>
              <td className="px-6 py-4"></td>
            </tr>
            {/* Data Rows */}
            {currentItems.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50">
                <td 
                  className="px-6 py-4 text-blue-600 cursor-pointer hover:underline"
                  onClick={() => view === 'location' && setSelectedLocation(row.location)}
                >
                  {row.location}
                </td>
                <td className="px-6 py-4">
                  {formatCurrency(row.potentialRevenue.value)} ({row.potentialRevenue.percentage}%)
                </td>
                <td className="px-6 py-4">
                  {formatCurrency(row.competitorProcessingVolume.value)} ({row.competitorProcessingVolume.percentage}%)
                </td>
                <td className="px-6 py-4">{row.competitorMerchant}</td>
                <td className="px-6 py-4">{formatCurrency(row.revenuePerAccount)}</td>
                <td className="px-6 py-4">{row.marketShareByRevenue}%</td>
                <td className="px-6 py-4">{row.commercialDDAs}</td>
                <td className="px-6 py-4">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(row._id)}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};