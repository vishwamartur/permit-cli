import React from 'react';
import { render } from 'ink-testing-library';
import { test, expect } from '@jest/globals';
import PDPCommand from './PDPCommand';
import { AuthProvider } from './AuthProvider';

jest.mock('./AuthProvider', () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = require('./AuthProvider');

describe('PDPCommand Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading message initially', () => {
    useAuth.mockReturnValue({ authToken: null });
    const { lastFrame } = render(
      <AuthProvider>
        <PDPCommand />
      </AuthProvider>
    );
    expect(lastFrame()).toContain('Loading command');
  });

  it('should display command when authToken is available', () => {
    useAuth.mockReturnValue({ authToken: 'mock-token' });
    const { lastFrame } = render(
      <AuthProvider>
        <PDPCommand />
      </AuthProvider>
    );
    expect(lastFrame()).toContain('docker run -p 7766:7000 --env PDP_API_KEY=mock-token --env PDP_DEBUG=true permitio/pdp-v2:latest');
  });

  it('should include OPA port in command if provided', () => {
    useAuth.mockReturnValue({ authToken: 'mock-token' });
    const { lastFrame } = render(
      <AuthProvider>
        <PDPCommand opa={8181} />
      </AuthProvider>
    );
    expect(lastFrame()).toContain('docker run -p 7766:7000 -p 8181:8181 --env PDP_API_KEY=mock-token --env PDP_DEBUG=true permitio/pdp-v2:latest');
  });
});
