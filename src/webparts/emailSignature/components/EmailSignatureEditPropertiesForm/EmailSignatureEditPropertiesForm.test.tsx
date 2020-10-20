import React from 'react';

import { setIconOptions } from '@fluentui/react/lib/Styling';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';

import { EmailSignatureEditPropertiesForm } from './EmailSignatureEditPropertiesForm';

// Suppress icon warnings.
setIconOptions({
  disableWarnings: true
});

// Mock out strings module
jest.mock(
  'EmailSignatureWebPartStrings',
  () => {
    return {
      CloseButton: 'Close',
      EditValuesButton: 'Edit signature',
      GivenNameFormLabel: 'First name'
    };
  },
  { virtual: true }
);

describe('Email signature edit properties form', () => {
  test('shows the edit button', () => {
    const { getByText } = render(
      <EmailSignatureEditPropertiesForm customProperties={[]} editProperty={() => {}} htmlTemplate={''} profileProperties={{}} />
    );

    expect(getByText(/Edit signature/)).toBeInTheDocument();
  });

  test('opens and closes the edit properties panel', () => {
    const { getByLabelText, getByText, queryByText } = render(
      <EmailSignatureEditPropertiesForm customProperties={[]} editProperty={() => {}} htmlTemplate={''} profileProperties={{}} />
    );

    expect(queryByText(/Close/)).toBeNull();

    fireEvent.click(getByText(/Edit signature/));

    expect(getByLabelText(/Close/)).toBeInTheDocument();

    fireEvent.click(getByLabelText(/Close/));

    expect(queryByText(/Close/)).toBeNull();
  });

  test('shows default profile property in the edit form', () => {
    const { getByText } = render(
      <EmailSignatureEditPropertiesForm
        customProperties={[]}
        editProperty={() => {}}
        htmlTemplate={'{{givenName}}'}
        profileProperties={{ givenName: 'First name' }}
      />
    );

    fireEvent.click(getByText(/Edit signature/));

    expect(getByText(/First name/)).toBeInTheDocument();
  });

  test('shows custom profile property in the edit form', () => {
    const { getByText, queryByText } = render(
      <EmailSignatureEditPropertiesForm
        customProperties={[
          {
            editable: true,
            key: 'companyName',
            value: 'Sample company',
            label: 'Company name'
          },
          {
            editable: false,
            key: 'companyWebsite',
            value: 'www.example.com',
            label: 'Company website domain'
          },
          {
            key: 'companyHref',
            value: 'https://www.example.com',
            label: 'Company website HREF'
          }
        ]}
        editProperty={() => {}}
        htmlTemplate={'{{companyName}} - {{companyWebsite}} - {{companyHref}}'}
        profileProperties={{}}
      />
    );

    fireEvent.click(getByText(/Edit signature/));

    expect(getByText(/Company name/)).toBeInTheDocument();
    expect(queryByText(/Company website domain/)).toBeNull();
    expect(getByText(/Company website HREF/)).toBeInTheDocument();
  });

  test('calls edit property callback on field change', () => {
    const editProperty = jest.fn();

    const { getByLabelText, getByText } = render(
      <EmailSignatureEditPropertiesForm
        customProperties={[]}
        editProperty={editProperty}
        htmlTemplate={'{{givenName}}'}
        profileProperties={{ givenName: 'First name' }}
      />
    );

    fireEvent.click(getByText(/Edit signature/));

    const input = getByLabelText(/First name/) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'New first name' } });

    expect(editProperty).toBeCalled();
    expect(input.value).toBe('New first name');
  });
});
