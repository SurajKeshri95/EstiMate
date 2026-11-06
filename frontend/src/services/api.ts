const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const estimationAPI = {
  createEstimation: async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/estimations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating estimation:', error);
      throw error;
    }
  },

  getEstimation: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/estimations/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting estimation:', error);
      throw error;
    }
  },

  getEstimations: async (skip = 0, take = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/estimations?skip=${skip}&take=${take}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting estimations:', error);
      throw error;
    }
  },

  updateEstimation: async (id: string, data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/estimations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating estimation:', error);
      throw error;
    }
  },

  deleteEstimation: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/estimations/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting estimation:', error);
      throw error;
    }
  },
};