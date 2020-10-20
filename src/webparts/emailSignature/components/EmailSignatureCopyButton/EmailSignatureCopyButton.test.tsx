import React from 'react';

import { setIconOptions } from '@fluentui/react/lib/Styling';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import { themeVariant } from '../../__mocks__/ThemeVariant';
import { EmailSignatureCopyButton } from './EmailSignatureCopyButton';

// Suppress icon warnings.
setIconOptions({
  disableWarnings: true
});

jest.mock(
  'EmailSignatureWebPartStrings',
  () => {
    return {
      CopySignatureButton: 'Copy signature',
      CopySignatureSuccessButton: 'Copied!'
    };
  },
  { virtual: true }
);

describe('Email signature copy button', () => {
  test('shows button text', () => {
    const { getByText } = render(<EmailSignatureCopyButton html={''} themeVariant={themeVariant} />);

    expect(getByText(/Copy signature/)).toBeInTheDocument();
  });

  test('shows success message on button click', async () => {
    document.execCommand = jest.fn();

    const { getByText } = render(<EmailSignatureCopyButton html={''} themeVariant={themeVariant} />);

    expect(getByText(/Copied!/)).not.toBeVisible();

    act(() => {
      fireEvent.click(getByText(/Copy signature/));
    });

    await waitFor(() => {
      expect(getByText(/Copied!/)).toBeVisible();
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });
});
