/** @jsx jsx */

import { jsx } from '@emotion/react';
import { setIconOptions } from '@fluentui/react/lib/Styling';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { EmailSignatureDownloadHtmlButton } from './EmailSignatureDownloadHtmlButton';

// Suppress icon warnings.
setIconOptions({
  disableWarnings: true
});

jest.mock(
  'EmailSignatureWebPartStrings',
  () => {
    return {
      DownloadAsHtmlButton: 'Download HTML'
    };
  },
  { virtual: true }
);

describe('Email signature download button', () => {
  test('shows button text', () => {
    const { getByText } = render(<EmailSignatureDownloadHtmlButton html={''} />);

    expect(getByText(/Download HTML/)).toBeInTheDocument();
  });
});
