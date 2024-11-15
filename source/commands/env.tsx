import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { z } from 'zod';
import { apiCall } from '../lib/api.js';
import { useAuth } from '../components/AuthProvider.js';
import { useMemberApi } from '../hooks/useMemberApi.js';
import { useProjectToken } from '../hooks/useProjectToken.js';

export const args = z.tuple([
	z.enum(['select', 'copy', 'member']).describe('Environment management command'),
]);

export const options = z.object({
	target: z.string().optional().describe('Target environment for copy command'),
	conflictStrategy: z
		.enum(['overwrite', 'skip'])
		.optional()
		.describe('Conflict strategy for copy command'),
	scope: z.string().optional().describe('Scope for copy command'),
	memberEmail: z.string().optional().describe('Email of the member to add'),
	memberRole: z.string().optional().describe('Role of the member to add'),
});

type Props = {
	args: z.infer<typeof args>;
	options: z.infer<typeof options>;
};

export default function Env({ args, options }: Props) {
	const command = args[0];
	const { authToken } = useAuth();
	const { addMember } = useMemberApi();
	const { getProjectToken } = useProjectToken();
	const [state, setState] = useState<
		'select' | 'copy' | 'member' | 'loading' | 'done'
	>('loading');
	const [environments, setEnvironments] = useState<[]>([]);
	const [selectedEnv, setSelectedEnv] = useState<any | undefined>(null);

	useEffect(() => {
		const fetchEnvironments = async () => {
			const { response: envs } = await apiCall('v2/envs', authToken ?? '');
			setEnvironments(envs.map((env: any) => ({ label: env.name, value: env.id })));
			setState(command);
		};

		if (authToken) {
			fetchEnvironments();
		}
	}, [authToken, command]);

	const handleEnvSelect = async (env: any) => {
		setSelectedEnv(env);
		setState('done');
	};

	const handleCopyEnv = async () => {
		const projectToken = await getProjectToken();
		await apiCall(
			`v2/envs/${selectedEnv.value}/copy`,
			projectToken,
			undefined,
			'POST',
			JSON.stringify({
				target: options.target,
				conflictStrategy: options.conflictStrategy,
				scope: options.scope,
			}),
		);
		setState('done');
	};

	const handleAddMember = async () => {
		await addMember(options.memberEmail, options.memberRole);
		setState('done');
	};

	return (
		<>
			{state === 'loading' && (
				<Text>
					<Spinner type="dots" /> Loading Environments...
				</Text>
			)}
			{state === 'select' && (
				<>
					<Text>Select an environment</Text>
					<SelectInput items={environments} onSelect={handleEnvSelect} />
				</>
			)}
			{state === 'copy' && selectedEnv && (
				<>
					<Text>Copying environment...</Text>
					{handleCopyEnv()}
				</>
			)}
			{state === 'member' && (
				<>
					<Text>Adding member...</Text>
					{handleAddMember()}
				</>
			)}
			{state === 'done' && <Text>Operation completed successfully.</Text>}
		</>
	);
}
