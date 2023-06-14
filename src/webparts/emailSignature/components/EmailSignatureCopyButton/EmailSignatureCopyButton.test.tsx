/** @jsx jsx */

import { jsx } from '@emotion/react';
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
      CopyAsHtmlButton: 'Copy as HTML',
      CopySignatureButton: 'Copy signature',
      CopySignatureSuccessButton: 'Copied!'
    };
  },
  { virtual: true }
);

describe('Email signature copy button', () => {
  test('shows button text', () => {
    const { getByText } = render(<EmailSignatureCopyButton copyAsHtml={false} html={''} themeVariant={themeVariant} />);

    expect(getByText(/Copy signature/)).toBeInTheDocument();
  });

  test('shows success message on button click', async () => {
    //@ts-ignore
    navigator.clipboard = {
      write: jest.fn()
    };
    window.ClipboardItem = jest.fn();

    const { getByText } = render(<EmailSignatureCopyButton copyAsHtml={false} html={''} themeVariant={themeVariant} />);

    expect(getByText(/Copied!/)).not.toBeVisible();

    act(() => {
      fireEvent.click(getByText(/Copy signature/));
    });

    await waitFor(() => {
      expect(getByText(/Copied!/)).toBeVisible();
      expect(navigator.clipboard.write).toHaveBeenCalled();
    });
  });

  test('shows HTML button text', () => {
    const { getByText } = render(<EmailSignatureCopyButton copyAsHtml={true} html={''} themeVariant={themeVariant} />);

    expect(getByText(/Copy as HTML/)).toBeInTheDocument();
  });

  test('shows success message on HTML button click', async () => {
    //@ts-ignore
    navigator.clipboard = {
      writeText: jest.fn()
    };
    window.ClipboardItem = jest.fn();

    const { getByText } = render(<EmailSignatureCopyButton copyAsHtml={true} html={''} themeVariant={themeVariant} />);

    expect(getByText(/Copied!/)).not.toBeVisible();

    act(() => {
      fireEvent.click(getByText(/Copy as HTML/));
    });

    await waitFor(() => {
      expect(getByText(/Copied!/)).toBeVisible();
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });
});
