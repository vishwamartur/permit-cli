import React, { useEffect, useState } from 'react';
import { Text, Box } from 'ink';
import Spinner from 'ink-spinner';
import { fetchResourceInstances, fetchRoles, fetchRelationships } from '../lib/api.js';
import { loadAuthToken } from '../lib/auth.js';

const fgaGraph = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [graphData, setGraphData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = await loadAuthToken();
				const [resourceInstances, roles, relationships] = await Promise.all([
					fetchResourceInstances(token),
					fetchRoles(token),
					fetchRelationships(token),
				]);

				setGraphData({
					resourceInstances: resourceInstances.response,
					roles: roles.response,
					relationships: relationships.response,
				});
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<Box>
				<Spinner type="dots" />
				<Text>Loading graph data...</Text>
			</Box>
		);
	}

	if (error) {
		return <Text color="red">Error: {error.message}</Text>;
	}

	return (
		<Box flexDirection="column">
			<Text>Graph Data:</Text>
			<Text>{JSON.stringify(graphData, null, 2)}</Text>
		</Box>
	);
};

export default fgaGraph;
