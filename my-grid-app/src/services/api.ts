import axios from 'axios';
import { DataRow } from '../types/data.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  getData: async (view: string, location?: string) => {
    const params = new URLSearchParams();
    params.append('view', view);
    if (location) params.append('location', location);
    const response = await axios.get<DataRow[]>(`${API_URL}/data?${params}`);
    return response.data;
  },
  
  deleteRow: async (id: string) => {
    return axios.delete(`${API_URL}/data/${id}`);
  }
};