import React from 'react';
import { render } from 'ink-testing-library';
import { AuthProvider, useAuth } from './AuthProvider';
import { Text } from 'ink';
import { act } from 'react-dom/test-utils';

jest.mock('../lib/auth', () => ({
  loadAuthToken: jest.fn(),
}));

const { loadAuthToken } = require('../lib/auth');

describe('AuthProvider', () => {
  it('should display loading message initially', () => {
    loadAuthToken.mockImplementation(() => new Promise(() => {}));
    const { lastFrame } = render(
      <AuthProvider>
        <Text>Child Component</Text>
      </AuthProvider>
    );
    expect(lastFrame()).toContain('Loading Token');
  });

  it('should display error message if token loading fails', async () => {
    loadAuthToken.mockRejectedValue(new Error('Failed to load token'));
    let lastFrame;
    await act(async () => {
      const { lastFrame: frame } = render(
        <AuthProvider>
          <Text>Child Component</Text>
        </AuthProvider>
      );
      lastFrame = frame;
    });
    expect(lastFrame()).toContain('Failed to load token');
  });

  it('should render children if token loading succeeds', async () => {
    loadAuthToken.mockResolvedValue('mock-token');
    let lastFrame;
    await act(async () => {
      const { lastFrame: frame } = render(
        <AuthProvider>
          <Text>Child Component</Text>
        </AuthProvider>
      );
      lastFrame = frame;
    });
    expect(lastFrame()).toContain('Child Component');
  });
});

describe('useAuth', () => {
  it('should throw error if used outside AuthProvider', () => {
    const TestComponent = () => {
      useAuth();
      return <Text>Test</Text>;
    };
    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });
});
