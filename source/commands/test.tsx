import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import zod from 'zod';
import { apiCall } from '../lib/api.js';

export const args = zod.tuple([
  zod.string().describe('The policy file to test'),
]);

type Props = {
  args: zod.infer<typeof args>;
};

export default function Test({ args }: Props) {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testPolicy = async () => {
      try {
        const response = await apiCall('test', 'POST', args[0]);
        if (response.status === 200) {
          setStatus('Testing successful');
        } else {
          setError(`Testing failed: ${response.status}`);
        }
      } catch (err) {
        setError(`Testing error: ${err}`);
      }
    };

    testPolicy();
  }, [args]);

  return (
    <Text>
      {status}
      {error && <Text color="red">{error}</Text>}
    </Text>
  );
}
