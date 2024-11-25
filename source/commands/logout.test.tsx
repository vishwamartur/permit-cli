import React from 'react';
import { render, act } from 'ink-testing-library';
import Logout from './logout';
import { cleanAuthToken } from '../lib/auth';

jest.mock('../lib/auth');

describe('Logout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display cleaning session message initially', () => {
    const { lastFrame } = render(<Logout />);
    expect(lastFrame()).toContain('Cleaning session...');
  });

  it('should call cleanAuthToken and display logged out message', async () => {
    (cleanAuthToken as jest.Mock).mockResolvedValueOnce(undefined);
    const { lastFrame } = render(<Logout />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(cleanAuthToken).toHaveBeenCalled();
    expect(lastFrame()).toContain('Logged Out');
  });
});
