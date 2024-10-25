import React from 'react';
import { Box, Newline, Text } from 'ink';
import zod from 'zod';
import { option } from 'pastel';
import { CLOUD_PDP_URL, KEYSTORE_PERMIT_SERVICE_NAME } from '../../config.js';
import Spinner from 'ink-spinner';
import axios from 'axios';
import { keyAccountOption } from '../../options/keychain.js';
import * as keytar from 'keytar';
import { inspect } from 'util';

export const options = zod.object({
	user: zod
		.string()
		.describe(
			option({ description: 'Unique Identity to check for', alias: 'u' }),
		),
	resource: zod
		.string()
		.describe(option({ description: 'Resource being accessed', alias: 'r' })),
	action: zod.string().describe(
		option({
			description: 'Action being performed on the resource by the user',
			alias: 'a',
		}),
	),
	tenant: zod
		.string()
		.default('default')
		.describe(
			option({
				description: 'the tenant the resource belongs to',
				alias: 't',
			}),
		),
	apiKey: zod
		.string()
		.optional()
		.describe(
			option({
				description: 'The API key for the Permit env, project or Workspace',
			}),
		),
	keyAccount: keyAccountOption,
});

type Props = {
	options: zod.infer<typeof options>;
};

interface AllowedResult {
	allow?: boolean;
}

export default function Check({ options }: Props) {
	const [error, setError] = React.useState(null);
	// result of API
	const [res, setRes] = React.useState<AllowedResult>({ allow: undefined });

	const queryPDP = (apiKey: String) => {
		const req = axios.post(
			`${CLOUD_PDP_URL}/allowed`,
			{
				user: { key: options.user },
				resource: { type: options.resource, tenant: options.tenant },
				action: options.action,
			},
			// pass api key if not empty
			{ headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {} },
		);
		req
			.then(result => {
				setRes(result.data);
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
			<Text>
				Checking user="{options.user}" action={options.action} resource=
				{options.resource} at tenant={options.tenant}
			</Text>
			{res.allow === true && (
				<>
					<Text color={'green'}> ALLOWED </Text>
					<Box marginLeft={4}>
						<Text>
							{inspect(res, {
								colors: true,
								depth: null,
								maxArrayLength: Infinity,
							})}
						</Text>
					</Box>
				</>
			)}
			{res.allow === false && <Text color={'red'}> DENIED</Text>}
			{res.allow === undefined && error === null && <Spinner type="dots" />}
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
