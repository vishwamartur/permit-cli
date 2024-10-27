import React from 'react';
import { AuthProvider } from '../../components/AuthProvider.js';
import PDPCommand from '../../components/PDPCommand.js';

export default function Run() {
	return (
		<AuthProvider>
			<PDPCommand />
		</AuthProvider>
	);
}
