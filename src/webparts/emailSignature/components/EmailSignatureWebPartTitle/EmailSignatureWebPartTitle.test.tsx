/** @jsx jsx */

import { jsx } from '@emotion/react';
import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/react';

import { EmailSignatureWebPartTitle } from './EmailSignatureWebPartTitle';

// Mock out strings module
jest.mock(
  'EmailSignatureWebPartStrings',
  () => ({
    WebPartTitleFieldLabel: 'Web part title'
  }),
  { virtual: true }
);

describe('Email signature web part title', () => {
  test('shows web part title', () => {
    const { getByText } = render(
      <EmailSignatureWebPartTitle
        displayMode={1} //{DisplayMode.Read}
        updateWebPartTitleText={() => {}}
        webPartTitleText="Sample web part title"
      />
    );

    expect(getByText(/Sample web part title/)).toBeInTheDocument();
  });

  test('not show when web part title is blank', () => {
    const { queryByText } = render(
      <EmailSignatureWebPartTitle
        displayMode={1} //{DisplayMode.Read}
        updateWebPartTitleText={() => {}}
        webPartTitleText=""
      />
    );

    expect(queryByText(/Sample web part title/)).toBeNull();
  });

  test('change when edited', () => {
    const onChange = jest.fn();

    const { getByText } = render(
      <EmailSignatureWebPartTitle
        displayMode={2} //{DisplayMode.Edit}
        updateWebPartTitleText={onChange}
        webPartTitleText="Sample web part title"
      />
    );

    const textarea = getByText(/Sample web part title/) as HTMLTextAreaElement;

    expect(textarea).toBeInTheDocument();

    act(() => {
      fireEvent.change(textarea, { target: { value: 'New web part title' } });
    });

    expect(onChange).toHaveBeenCalled();
    expect(textarea.value).toBe('New web part title');
  });
});
