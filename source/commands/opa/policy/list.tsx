import React from 'react';
import { Box, Newline, Text } from 'ink';
import zod from 'zod';
import { option } from 'pastel';
import { KEYSTORE_PERMIT_SERVICE_NAME } from '../../../config.js';
import Spinner from 'ink-spinner';
import axios from 'axios';
import { keyAccountOption } from '../../../options/keychain.js';
import { inspect } from 'util';
import * as keytar from 'keytar';

export const options = zod.object({
	serverUrl: zod
		.string()
		.default('http://localhost:8181')
		.describe(
			option({
				description: 'The OPA server URL',
				alias: 's',
			}),
		),
	apiKey: zod
		.string()
		.optional()
		.describe(
			option({
				description:
					'The API key for the OPA Server and Permit env, project or Workspace',
			}),
		),
	keyAccount: keyAccountOption,
});

type Props = {
	options: zod.infer<typeof options>;
};

interface QueryResult {
	result?: string;
	status?: number;
}

export default function List({ options }: Props) {
	const [error, setError] = React.useState(null);
	// result of API
	const [res, setRes] = React.useState<QueryResult>({
		result: undefined,
		status: 0,
	});

	const queryPDP = (apiKey: String) => {
		const req = axios.get(
			`${options.serverUrl}/v1/policies`,
			// pass api key if not empty
			{ headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {} },
		);
		req
			.then(result => {
				setRes({ result: result.data, status: result.status });
			})
			.catch(reason => {
				setError(reason);
			});
	};

	React.useEffect(() => {
		keytar
			.getPassword(KEYSTORE_PERMIT_SERVICE_NAME, options.keyAccount)
			.then(value => {
				const apiKey = value || '';
				queryPDP(apiKey);
			})
			.catch(reason => {
				setError(reason);
			});
	}, []);

	return (
		<>
			<Text>Listing Policies on Opa Server={options.serverUrl}</Text>
			{res.status === 200 && (
				<>
					<Box marginLeft={4}>
						<Text>
							{inspect(res.result, {
								colors: true,
								depth: null,
								maxArrayLength: Infinity,
							})}
						</Text>
					</Box>
				</>
			)}
			{res.status === 0 && error === null && <Spinner type="dots" />}
			{error && (
				<Box>
					<Text color="red">Request failed: {JSON.stringify(error)}</Text>
					<Newline />
					<Text>{JSON.stringify(res)}</Text>
				</Box>
			)}
		</>
	);
}
