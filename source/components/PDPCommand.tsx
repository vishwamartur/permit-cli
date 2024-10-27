import React from 'react';
import { Newline, Text } from 'ink';
import Spinner from 'ink-spinner';
import { useAuth } from './AuthProvider.js';

export default function PDPCommand() {
	const { authToken } = useAuth();
	return authToken ? (
		<>
			<Text color="green">Run the following command from your terminal:</Text>
			<Text>
				docker run -p 7766:7000 --env PDP_API_KEY=${authToken} --env
				PDP_DEBUG=true permitio/pdp-v2:latest
			</Text>
		</>
	) : (
		<Text>
			<Spinner type="dots" />
			Loading command
		</Text>
	);
}
