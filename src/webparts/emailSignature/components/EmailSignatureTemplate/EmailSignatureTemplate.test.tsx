/** @jsx jsx */

import { jsx } from '@emotion/react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { themeVariant } from '../../__mocks__/ThemeVariant';
import { EmailSignatureTemplate } from './EmailSignatureTemplate';

describe('Email signature template', () => {
  test('shows the given HTML', () => {
    const { getByText } = render(<EmailSignatureTemplate html={'<p>All the best</p>'} themeVariant={themeVariant} />);

    expect(getByText(/All the best/)).toBeInTheDocument();
  });
});
