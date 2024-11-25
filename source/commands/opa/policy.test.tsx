import React from 'react';
import { render, act } from 'ink-testing-library';
import Policy from './policy';
import { loadAuthToken } from '../../lib/auth';

jest.mock('../../lib/auth');

describe('Policy Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading spinner initially', () => {
    const { lastFrame } = render(<Policy options={{ serverUrl: 'http://localhost:8181', keyAccount: 'testAccount' }} />);
    expect(lastFrame()).toContain('Listing Policies on Opa Server=http://localhost:8181');
  });

  it('should display policies after loading', async () => {
    (loadAuthToken as jest.Mock).mockResolvedValueOnce('testApiKey');
    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ result: [{ id: 'policy1' }, { id: 'policy2' }] }),
      status: 200,
    });
    global.fetch = mockFetch as any;
    const { lastFrame } = render(<Policy options={{ serverUrl: 'http://localhost:8181', keyAccount: 'testAccount' }} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(lastFrame()).toContain('Showing 2 of 2 policies:');
  });

  it('should display error message on request failure', async () => {
    (loadAuthToken as jest.Mock).mockResolvedValueOnce('testApiKey');
    const mockFetch = jest.fn().mockRejectedValueOnce(new Error('Request failed'));
    global.fetch = mockFetch as any;
    const { lastFrame } = render(<Policy options={{ serverUrl: 'http://localhost:8181', keyAccount: 'testAccount' }} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(lastFrame()).toContain('Request failed:');
  });
});
