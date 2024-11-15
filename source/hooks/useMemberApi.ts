import { useState } from 'react';
import { apiCall } from '../lib/api.js';
import { useAuth } from '../components/AuthProvider.js';

export const useMemberApi = () => {
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMember = async (email: string, role: string) => {
    setLoading(true);
    setError(null);

    try {
      await apiCall(
        'v2/members',
        authToken ?? '',
        undefined,
        'POST',
        JSON.stringify({ email, role })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    addMember,
    loading,
    error,
  };
};
