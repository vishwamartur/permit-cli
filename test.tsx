import React from 'react';
import chalk from 'chalk';
import { test } from 'node:test';
import { render } from 'ink-testing-library';
import assert from 'node:assert';
import Check from './source/commands/pdp/check.js';

const API_KEY = process.env.API_KEY;

test('basic', t => {
	t.test('Should return ALLOWED', () => {
		const { lastFrame, rerender, frames } = render(
			<Check
				options={{
					user: 'filip@permit.io',
					action: 'create',
					resource: 'task',
					apiKey: API_KEY,
					// optional
					tenant: 'default',
					keyAccount: '',
				}}
			/>,
		);
		const res = frames;
		assert.equal(res, 'ALLOWED');
	});
});
