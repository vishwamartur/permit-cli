import React from 'react';
import { test } from 'node:test';
import { render } from 'ink-testing-library';
import assert from 'node:assert';
import Env from '../source/commands/env.js';

test('env select', t => {
	t.test('Should display environment selection', async () => {
		const { lastFrame } = render(
			<Env
				args={['select']}
				options={{}}
			/>,
		);
		const res = lastFrame();
		assert.match(res, /Select an environment/);
	});
});

test('env copy', t => {
	t.test('Should display copying environment', async () => {
		const { lastFrame } = render(
			<Env
				args={['copy']}
				options={{ target: 'new-env', conflictStrategy: 'overwrite', scope: 'all' }}
			/>,
		);
		const res = lastFrame();
		assert.match(res, /Copying environment/);
	});
});

test('env member', t => {
	t.test('Should display adding member', async () => {
		const { lastFrame } = render(
			<Env
				args={['member']}
				options={{ memberEmail: 'test@example.com', memberRole: 'admin' }}
			/>,
		);
		const res = lastFrame();
		assert.match(res, /Adding member/);
	});
});
