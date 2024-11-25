import React from 'react';
import { render } from 'ink-testing-library';
import Run from './run';
import { AuthProvider } from '../../components/AuthProvider';
import PDPCommand from '../../components/PDPCommand';

jest.mock('../../components/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../components/PDPCommand', () => ({
  __esModule: true,
  default: ({ opa }: { opa?: number }) => <div>PDPCommand {opa}</div>,
}));

describe('Run Component', () => {
  it('should render AuthProvider and PDPCommand components', () => {
    const { lastFrame } = render(<Run options={{ opa: 8181 }} />);
    expect(lastFrame()).toContain('PDPCommand 8181');
  });

  it('should render PDPCommand without opa prop', () => {
    const { lastFrame } = render(<Run options={{}} />);
    expect(lastFrame()).toContain('PDPCommand');
  });
});
