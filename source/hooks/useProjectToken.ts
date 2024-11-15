import { useState } from 'react';
import { apiCall } from '../lib/api.js';
import { useAuth } from '../components/AuthProvider.js';

export const useProjectToken = () => {
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProjectToken = async () => {
    setLoading(true);
    setError(null);

    try {
      const { response } = await apiCall('v2/projects/token', authToken ?? '');
      return response.token;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getProjectToken,
    loading,
    error,
  };
};
