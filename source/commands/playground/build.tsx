import React, { useState, useEffect } from 'react';
import { Text, Box, Newline } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { type infer as zInfer, object, string } from 'zod';
import { option } from 'pastel';
import { apiCall } from '../../lib/api.js';
import { AuthProvider, useAuth } from '../../components/AuthProvider.js';

export const options = object({
  key: string()
    .optional()
    .describe(
      option({
        description: 'Use API key instead of user authentication',
        alias: 'k',
      }),
    ),
  workspace: string()
    .optional()
    .describe(
      option({
        description: 'Use predefined workspace to Login',
      }),
    ),
});

type Props = {
  readonly options: zInfer<typeof options>;
};

export default function Build({ options: { key, workspace } }: Props) {
  const { authToken, loading, error } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [state, setState] = useState<'loading' | 'selecting' | 'done'>('loading');

  useEffect(() => {
    const fetchPolicies = async () => {
      const { response } = await apiCall('v2/policies', authToken ?? '');
      setPolicies(response);
      setState('selecting');
    };

    if (authToken) {
      fetchPolicies();
    }
  }, [authToken]);

  const handleSelect = (item: any) => {
    setSelectedPolicy(item);
    setState('done');
  };

  return (
    <AuthProvider>
      {loading && <Spinner type="dots" />}
      {error && <Text color="red">{error}</Text>}
      {state === 'selecting' && (
        <>
          <Text>Select a policy to build:</Text>
          <SelectInput items={policies.map((policy: any) => ({ label: policy.name, value: policy }))} onSelect={handleSelect} />
        </>
      )}
      {state === 'done' && selectedPolicy && (
        <Box flexDirection="column">
          <Text>Selected Policy: {selectedPolicy.label}</Text>
          <Newline />
          <Text>Building policy...</Text>
          {/* Add AI suggestions and policy building logic here */}
        </Box>
      )}
    </AuthProvider>
  );
}
