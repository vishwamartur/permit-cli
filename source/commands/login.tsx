import React, {useEffect, useState} from 'react';
import {createHash, randomBytes} from 'crypto';
import * as http from 'http';
import {Text} from 'ink';
import open from 'open';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';

export default function Login() {
	const [orgs, setOrgs] = useState<[]>([]);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [cookie, setCookie] = useState<string | undefined>('');
	const [activeOrg, setActiveOrg] = useState<any | null>(null);
	const [activeProject, setActiveProject] = useState<any | null>(null);
	const [activeEnvironment, setActiveEnvironment] = useState<any | null>(null);
	const [projects, setProjects] = useState<[]>([]);
	const [environments, setEnvironments] = useState<[]>([]);
	const [state, setState] = useState<
		'login' | 'loggingIn' | 'org' | 'project' | 'environment' | 'done'
	>('login');

	useEffect(() => {
		const fetchOrgs = async () => {
			const orgs = await fetch('https://api.permit.io/v2/orgs', {
				method: 'GET',
				headers: {
					Accept: '*/*',
					Origin: 'https://app.permit.io',
					Authorization: `Bearer ${accessToken}`,
					Cookie: cookie || '',
				},
			}).then(response => response.json());
			if (orgs && orgs.length === 1) {
				setActiveOrg({label: orgs[0].name, value: orgs[0].id});
				setState('project');
			}
			setOrgs(orgs.map((org: any) => ({label: org.name, value: org.id})));
		};
		if (accessToken && cookie && state === 'org') {
			fetchOrgs();
		}
	}, [cookie, state]);

	useEffect(() => {
		const fetchCookie = async () => {
			await fetch('https://api.permit.io/v2/auth/login', {
				method: 'POST',
				body: null,
				headers: {
					Accept: '*/*',
					Origin: 'https://app.permit.io',
					Authorization: `Bearer ${accessToken}`,
				},
			})
				.then(response => {
					setCookie(response.headers.getSetCookie()[0]);
					return response;
				})
				.then(response => response.json());
			setState('org');
		};
		if (accessToken && state === 'loggingIn') {
			fetchCookie();
		}
	}, [accessToken]);

	useEffect(() => {
		const fetchProjects = async () => {
			let newCookie = cookie || '';
			await fetch(
				`https://api.permit.io/v2/auth/switch_org/${activeOrg.value}`,
				{
					headers: {
						Accept: '*/*',
						Origin: 'https://app.permit.io',
						Authorization: `Bearer ${accessToken}`,
						Cookie: cookie || '',
					},
					body: null,
					method: 'POST',
				},
			)
				.then(response => {
					newCookie = response.headers.getSetCookie()[0] || '';
					setCookie(newCookie);
					return response;
				})
				.then(response => response.json());

			const projects = await fetch(`https://api.permit.io/v2/projects`, {
				method: 'GET',
				headers: {
					Accept: '*/*',
					Origin: 'https://app.permit.io',
					Authorization: `Bearer ${accessToken}`,
					Cookie: newCookie || '',
				},
			}).then(response => response.json());
			if (projects.length === 1) {
				setActiveProject({label: projects[0].name, value: projects[0].id});
				setState('environment');
			}
			setProjects(
				projects.map((project: any) => ({
					label: project.name,
					value: project.id,
				})),
			);
		};
		if (activeOrg) {
			fetchProjects();
		}
	}, [activeOrg]);

	useEffect(() => {
		const fetchEnvironments = async () => {
			const environments = await fetch(
				`https://api.permit.io/v2/projects/${activeProject.value}/envs`,
				{
					method: 'GET',
					headers: {
						Accept: '*/*',
						Origin: 'https://app.permit.io',
						Authorization: `Bearer ${accessToken}`,
						Cookie: cookie || '',
					},
				},
			).then(response => response.json());
			setEnvironments(
				environments.map((environment: any) => ({
					label: environment.name,
					value: environment.id,
				})),
			);
		};
		if (activeProject) {
			fetchEnvironments();
		}
	}, [activeProject]);

	useEffect(() => {
		if (state === 'done') {
			process.exit(0);
		}
	}, [state]);

	const handleOrgSelect = async (org: any) => {
		setActiveOrg(org);
		setState('project');
	};

	const authCallbackServer = async (verifier: string) => {
		return new Promise<void>(resolve => {
			// Define the server logic
			const server = http.createServer(async (req, res) => {
				// Get the authorization code from the query string
				const url = new URL(req.url!, `http://${req.headers.host}`);
				if (!url.searchParams.has('code')) {
					res.statusCode = 200; // Set the response status code
					res.setHeader('Content-Type', 'text/plain'); // Set the content type
					res.end('Authorization code not found in query string\n'); // Send the response
					return;
				}
				const code = url.searchParams.get('code');
				// Send the response
				await fetch('https://auth.permit.io/oauth/token', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						grant_type: 'authorization_code',
						client_id: 'Pt7rWJ4BYlpELNIdLg6Ciz7KQ2C068C1',
						code_verifier: verifier,
						code,
						redirect_uri: 'http://localhost:62419',
					}),
				})
					.then(response => response.json())
					.then(data => {
						setAccessToken(data.access_token);
					});
				res.statusCode = 200; // Set the response status code
				res.setHeader('Content-Type', 'text/plain'); // Set the content type
				res.end('You can close this page now\n'); // Send the response
				server.close(); // Close the server
				resolve(); // Resolve the promise
			});

			// Specify the port and host
			const port = 62419;
			const host = 'localhost';

			// Start the server and listen on the specified port
			server.listen(port, host);

			setTimeout(() => {
				server.close();
				resolve();
			}, 600000);
		});
	};

	useEffect(() => {
		const authenticateUser = async () => {
			// Open the authentication URL in the default browser
			function base64URLEncode(str: string | Buffer) {
				return str
					.toString('base64')
					.replace(/\+/g, '-')
					.replace(/\//g, '_')
					.replace(/=/g, '');
			}
			const verifier = base64URLEncode(randomBytes(32));
			function sha256(buffer: string | Buffer) {
				return createHash('sha256').update(buffer).digest();
			}
			const challenge = base64URLEncode(sha256(verifier));
			const params = new URLSearchParams({
				audience: 'https://api.permit.io/v1/',
				screen_hint: 'app.permit.io',
				domain: 'app.permit.io',
				auth0Client: 'eyJuYW1lIjoiYXV0aDAtcmVhY3QiLCJ2ZXJzaW9uIjoiMS4xMC4yIn0=',
				isEAP: 'false',
				response_type: 'code',
				fragment: 'domain=app.permit.io',
				code_challenge: challenge,
				code_challenge_method: 'S256',
				client_id: 'Pt7rWJ4BYlpELNIdLg6Ciz7KQ2C068C1',
				redirect_uri: 'http://localhost:62419',
				scope: 'openid profile email',
				state: 'bFR2dn5idUhBVDNZYlhlSEFHZnJaSjRFdUhuczdaSlhCSHFDSGtlYXpqbQ==',
			});
			open(`https://auth.permit.io/authorize?${params.toString()}`);
			setState('loggingIn');
			await authCallbackServer(verifier);
		};
		authenticateUser();
	}, []);

	return (
		<>
			{state === 'login' && <Text>Login to Permit</Text>}
			{state === 'loggingIn' && (
				<Text>
					<Spinner type="dots" /> Logging in...
				</Text>
			)}
			{state === 'org' &&
				(orgs && orgs.length ? (
					<>
						<Text>Select an organization</Text>
						<SelectInput items={orgs} onSelect={handleOrgSelect} />
					</>
				) : (
					<Text>
						<Spinner type="dots" /> Loading Organizations
					</Text>
				))}
			{state === 'project' &&
				(projects && projects.length ? (
					<>
						<Text>Select a project</Text>
						<SelectInput
							items={projects}
							onSelect={project => {
								setActiveProject(project);
								setState('environment');
							}}
						/>
					</>
				) : (
					<Text>
						<Spinner type="dots" /> Loading Projects
					</Text>
				))}
			{state === 'environment' &&
				(environments && environments.length ? (
					<>
						<Text>Select an environment</Text>
						<SelectInput
							items={environments}
							onSelect={environment => {
								setActiveEnvironment(environment);
								setState('done');
							}}
						/>
					</>
				) : (
					<Text>
						<Spinner type="dots" /> Loading Environments
					</Text>
				))}
			{state === 'done' && activeOrg && (
				<Text>
					Logged in as {activeOrg.label} with selected environment as{' '}
					{activeEnvironment ? activeEnvironment.label : 'None'}
				</Text>
			)}
		</>
	);
}
