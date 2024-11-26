#!/usr/bin/env node
import Pastel from 'pastel';
import fgaGraph from './commands/fgaGraph.js';

const app = new Pastel({
	importMeta: import.meta,
});

app.command('fga graph', fgaGraph);

await app.run();
