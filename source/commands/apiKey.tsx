import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import * as fs from 'fs';
import {KEY_FILE_PATH} from '../config.js';

export const args = zod.tuple([zod.string().describe('The key to save')]);

type Props = {
	args: zod.infer<typeof args>;
};

export default function apiKey({args}: Props) {
	const key: string = args[0];
	const isValid = key.length >= 97 && key.startsWith('permit_key_');

	if (isValid) {
		fs.writeFileSync(KEY_FILE_PATH, args[0]);
		return (
			<Text>
				<Text color="green">Key saved to './permit.key'</Text>
			</Text>
		);
	} else {
		return (
			<Text>
				<Text color="red">Key is not valid.</Text>
			</Text>
		);
	}
}
