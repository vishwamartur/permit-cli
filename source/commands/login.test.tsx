import React from 'react';
import { render, act } from 'ink-testing-library';
import Login from './login';
import { apiCall } from '../lib/api';
import { authCallbackServer, browserAuth, saveAuthToken, TokenType, tokenType } from '../lib/auth';

jest.mock('../lib/api');
jest.mock('../lib/auth');

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display login message initially', () => {
    const { lastFrame } = render(<Login options={{ key: undefined, workspace: undefined }} />);
    expect(lastFrame()).toContain('Login to Permit');
  });

  it('should display logging in message when logging in', async () => {
    const { lastFrame } = render(<Login options={{ key: undefined, workspace: undefined }} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(lastFrame()).toContain('Logging in...');
  });

  it('should display organizations after logging in', async () => {
    (apiCall as jest.Mock).mockResolvedValueOnce({
      response: [{ id: 'org1', name: 'Org 1' }],
      headers: { getSetCookie: jest.fn().mockReturnValue(['cookie']) },
    });
    (browserAuth as jest.Mock).mockResolvedValueOnce('verifier');
    (authCallbackServer as jest.Mock).mockResolvedValueOnce('token');
    const { lastFrame } = render(<Login options={{ key: undefined, workspace: undefined }} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(lastFrame()).toContain('Select an organization');
  });

  it('should display projects after selecting an organization', async () => {
    (apiCall as jest.Mock).mockResolvedValueOnce({
      response: [{ id: 'org1', name: 'Org 1' }],
      headers: { getSetCookie: jest.fn().mockReturnValue(['cookie']) },
    });
    (apiCall as jest.Mock).mockResolvedValueOnce({
      response: [{ id: 'project1', name: 'Project 1' }],
      headers: { getSetCookie: jest.fn().mockReturnValue(['cookie']) },
    });
    (browserAuth as jest.Mock).mockResolvedValueOnce('verifier');
    (authCallbackServer as jest.Mock).mockResolvedValueOnce('token');
    const { lastFrame } = render(<Login options={{ key: undefined, workspace: undefined }} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(lastFrame()).toContain('Select a project');
  });

  it('should display environments after selecting a project', async () => {
    (apiCall as jest.Mock).mockResolvedValueOnce({
      response: [{ id: 'org1', name: 'Org 1' }],
      headers: { getSetCookie: jest.fn().mockReturnValue(['cookie']) },
    });
    (apiCall as jest.Mock).mockResolvedValueOnce({
      response: [{ id: 'project1', name: 'Project 1' }],
      headers: { getSetCookie: jest.fn().mockReturnValue(['cookie']) },
    });
    (apiCall as jest.Mock).mockResolvedValueOnce({
      response: [{ id: 'env1', name: 'Environment 1' }],
      headers: { getSetCookie: jest.fn().mockReturnValue(['cookie']) },
    });
    (browserAuth as jest.Mock).mockResolvedValueOnce('verifier');
    (authCallbackServer as jest.Mock).mockResolvedValueOnce('token');
    const { lastFrame } = render(<Login options={{ key: undefined, workspace: undefined }} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(lastFrame()).toContain('Select an environment');
  });

  it('should display success message after selecting an environment', async () => {
    (apiCall as jest.Mock).mockResolvedValueOnce({
      response: [{ id: 'org1', name: 'Org 1' }],
      headers: { getSetCookie: jest.fn().mockReturnValue(['cookie']) },
    });
    (apiCall as jest.Mock).mockResolvedValueOnce({
      response: [{ id: 'project1', name: 'Project 1' }],
      headers: { getSetCookie: jest.fn().mockReturnValue(['cookie']) },
    });
    (apiCall as jest.Mock).mockResolvedValueOnce({
      response: [{ id: 'env1', name: 'Environment 1' }],
      headers: { getSetCookie: jest.fn().mockReturnValue(['cookie']) },
    });
    (apiCall as jest.Mock).mockResolvedValueOnce({
      response: { secret: 'secret' },
      headers: { getSetCookie: jest.fn().mockReturnValue(['cookie']) },
    });
    (browserAuth as jest.Mock).mockResolvedValueOnce('verifier');
    (authCallbackServer as jest.Mock).mockResolvedValueOnce('token');
    const { lastFrame } = render(<Login options={{ key: undefined, workspace: undefined }} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(lastFrame()).toContain('Logged in as Org 1 with selected environment as Environment 1');
  });

  it('should display error message for invalid API key', async () => {
    const { lastFrame } = render(<Login options={{ key: 'invalid_key', workspace: undefined }} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(lastFrame()).toContain('Invalid API Key');
  });
});
