import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import zod from 'zod';
import { apiCall } from '../lib/api.js';

export const args = zod.tuple([
  zod.string().describe('The policy file to deploy'),
]);

type Props = {
  args: zod.infer<typeof args>;
};

export default function Deploy({ args }: Props) {
  const [status, setStatus] = useState('Deploying...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const deployPolicy = async () => {
      try {
        const response = await apiCall('deploy', 'POST', args[0]);
        if (response.status === 200) {
          setStatus('Deployment successful');
        } else {
          setError(`Deployment failed: ${response.status}`);
        }
      } catch (err) {
        setError(`Deployment error: ${err}`);
      }
    };

    deployPolicy();
  }, [args]);

  return (
    <Text>
      {status}
      {error && <Text color="red">{error}</Text>}
    </Text>
  );
}
