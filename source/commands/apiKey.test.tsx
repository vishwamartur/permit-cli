import React from 'react';
import { render } from 'ink-testing-library';
import { test, expect } from '@jest/globals';
import ApiKey, { args, options } from './apiKey';
import keytar from 'keytar';

jest.mock('keytar');

const mockGetPassword = keytar.getPassword as jest.Mock;
const mockSetPassword = keytar.setPassword as jest.Mock;

const defaultProps = {
	args: ['save', 'permit_key_1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567'],
	options: {
		keyAccount: 'testAccount',
	},
};

test('ApiKey component - save valid key', () => {
	const { lastFrame } = render(<ApiKey {...defaultProps} />);
	expect(lastFrame()).toContain('Key saved to secure key store.');
	expect(mockSetPassword).toHaveBeenCalledWith('Permit.io', 'testAccount', 'permit_key_1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567');
});

test('ApiKey component - validate valid key', () => {
	const props = {
		...defaultProps,
		args: ['validate', 'permit_key_1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567'],
	};
	const { lastFrame } = render(<ApiKey {...props} />);
	expect(lastFrame()).toContain('Key is valid.');
});

test('ApiKey component - read key', async () => {
	mockGetPassword.mockResolvedValue('permit_key_1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567');
	const props = {
		...defaultProps,
		args: ['read', ''],
	};
	const { lastFrame } = render(<ApiKey {...props} />);
	await new Promise(resolve => setTimeout(resolve, 0)); // Wait for useEffect
	expect(lastFrame()).toContain('permit_key_1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567');
	expect(mockGetPassword).toHaveBeenCalledWith('Permit.io', 'testAccount');
});

test('ApiKey component - invalid key', () => {
	const props = {
		...defaultProps,
		args: ['save', 'invalid_key'],
	};
	const { lastFrame } = render(<ApiKey {...props} />);
	expect(lastFrame()).toContain('Key is not valid.');
});
