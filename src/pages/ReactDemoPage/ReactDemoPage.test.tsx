import React from 'react';
import { render, screen } from '@testing-library/react';

import { ReactDemoPage } from './ReactDemoPage';

test('renders learn react link', () => {
  render(<ReactDemoPage />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
