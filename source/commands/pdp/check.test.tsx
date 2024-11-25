import React from 'react';
import { render, act } from 'ink-testing-library';
import Check from './check';
import { keytar } from 'keytar';

jest.mock('keytar');

describe('Check Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display checking message initially', () => {
    const { lastFrame } = render(<Check options={{ user: 'testUser', action: 'create', resource: 'task', keyAccount: 'testAccount' }} />);
    expect(lastFrame()).toContain('Checking user="testUser" action=create resource=task at tenant=default');
  });

  it('should display allowed message when access is allowed', async () => {
    (keytar.getPassword as jest.Mock).mockResolvedValueOnce('testApiKey');
    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ allow: true }),
      status: 200,
    });
    global.fetch = mockFetch as any;
    const { lastFrame } = render(<Check options={{ user: 'testUser', action: 'create', resource: 'task', keyAccount: 'testAccount' }} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(lastFrame()).toContain('ALLOWED');
  });

  it('should display denied message when access is denied', async () => {
    (keytar.getPassword as jest.Mock).mockResolvedValueOnce('testApiKey');
    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ allow: false }),
      status: 200,
    });
    global.fetch = mockFetch as any;
    const { lastFrame } = render(<Check options={{ user: 'testUser', action: 'create', resource: 'task', keyAccount: 'testAccount' }} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(lastFrame()).toContain('DENIED');
  });

  it('should display error message on request failure', async () => {
    (keytar.getPassword as jest.Mock).mockResolvedValueOnce('testApiKey');
    const mockFetch = jest.fn().mockRejectedValueOnce(new Error('Request failed'));
    global.fetch = mockFetch as any;
    const { lastFrame } = render(<Check options={{ user: 'testUser', action: 'create', resource: 'task', keyAccount: 'testAccount' }} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(lastFrame()).toContain('Request failed:');
  });
});
