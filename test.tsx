import React from 'react';
import chalk from 'chalk';
import { test } from 'node:test';
import { render } from 'ink-testing-library';
import assert from 'node:assert';
import Check from './source/commands/pdp/check.js';
import Login from './source/commands/login.js';

const API_KEY = process.env.API_KEY;

test('check', t => {
	t.test('Should Display Checking indicator', () => {
		const { lastFrame } = render(
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
		const res = lastFrame();
		assert.equal(
			res,
			'Checking user="filip@permit.io" action=create resource=task at tenant=default\n⠋',
		);
	});
});

test('login', t => {
	t.test('Should prompt to create a new workspace if none found', () => {
		const { lastFrame } = render(
			<Login
				options={{
					key: API_KEY,
					workspace: '',
				}}
			/>,
		);
		const res = lastFrame();
		assert.equal(res, 'No workspaces found. Please create a new workspace.\n');
	});

	t.test('Should prompt to create a new project if none found', () => {
		const { lastFrame } = render(
			<Login
				options={{
					key: API_KEY,
					workspace: 'existingWorkspace',
				}}
			/>,
		);
		const res = lastFrame();
		assert.equal(res, 'No projects found. Please create a new project.\n');
	});
});
