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

export default function Test({ options: { key, workspace } }: Props) {
  const { authToken, loading, error } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [state, setState] = useState<'loading' | 'selecting' | 'testing' | 'done'>('loading');

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

  const handleSelect = async (item: any) => {
    setSelectedPolicy(item);
    setState('testing');
    const { response } = await apiCall(`v2/policies/${item.value}/test`, authToken ?? '');
    setTestResults(response);
    setState('done');
  };

  return (
    <AuthProvider>
      {loading && <Spinner type="dots" />}
      {error && <Text color="red">{error}</Text>}
      {state === 'selecting' && (
        <>
          <Text>Select a policy to test:</Text>
          <SelectInput items={policies.map((policy: any) => ({ label: policy.name, value: policy }))} onSelect={handleSelect} />
        </>
      )}
      {state === 'testing' && (
        <Box flexDirection="column">
          <Text>Testing policy...</Text>
          <Spinner type="dots" />
        </Box>
      )}
      {state === 'done' && testResults && (
        <Box flexDirection="column">
          <Text>Test Results:</Text>
          <Newline />
          <Text>{JSON.stringify(testResults, null, 2)}</Text>
        </Box>
      )}
    </AuthProvider>
  );
}
