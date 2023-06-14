import React from 'react';

import { setIconOptions } from '@fluentui/react/lib/Styling';
import { DisplayMode } from '@microsoft/sp-core-library';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { themeVariant } from '../../__mocks__/ThemeVariant';
import { UserPhoto } from '../../__mocks__/UserPhoto';
import { UserProfileProperties } from '../../__mocks__/UserProfileProperties';

import { EmailSignatureService } from '../../services/EmailSignatureService';
import { EmailSignature } from './EmailSignature';

// Suppress icon warnings.
setIconOptions({
  disableWarnings: true
});

// Mock out strings module
jest.mock(
  'EmailSignatureWebPartStrings',
  () => ({
    BusinessPhonesFormLabel: 'Business phone',
    CityFormLabel: 'City',
    CloseButton: 'Close',
    CopySignatureButton: 'Copy signature',
    CopySignatureSuccessButton: 'Copied!',
    CountryFormLabel: 'Country',
    CustomPropertyCollectionLabel: 'Custom properties',
    CustomPropertyManageButton: 'Manage custom properties',
    DepartmentFormLabel: 'Department',
    DisplayNameFormLabel: 'Name',
    EditValuesButton: 'Edit signature',
    ErrorMessage: 'Sorry, an error occurred. Try refreshing the page.',
    GivenNameFormLabel: 'First name',
    JobTitleFormLabel: 'Job title',
    MailFormLabel: 'Email',
    MobilePhoneFormLabel: 'Mobile number',
    OfficeLocationFormLabel: 'Office location',
    PostalCodeFormLabel: 'ZIP or postal code',
    StateFormLabel: 'State or province',
    StreetAddressFormLabel: 'Street address',
    SurnameFormLabel: 'Last name'
  }),
  { virtual: true }
);

jest.mock('../../services/EmailSignatureService', () => ({
  EmailSignatureService: jest.fn().mockImplementation(() => ({
    getUserProfileProperties: jest.fn().mockImplementation(() => UserProfileProperties),
    getUserPhotoAsBase64: jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(`data:image/jpeg;base64,${UserPhoto}`);
      });
    })
  }))
}));

describe('Email signature web part', () => {
  window.DEBUG = false;

  const DEFAULT_PROPS = {
    addCircleMask: false,
    //@ts-ignore
    customProperties: [],
    displayMode: DisplayMode.Read,
    enableEditing: true,
    forceLowercaseEmails: false,
    htmlTemplate: '<p>All the best</p>',
    imageSize: 130,
    themeVariant: themeVariant,
    updateWebPartTitleText: () => {},
    webPartTitleText: 'Email signature'
  };

  const msGraphClient = (jest.fn() as unknown) as MSGraphClientV3;

  test('shows the given HTML', async () => {
    const emailSignatureService = new EmailSignatureService(msGraphClient);

    const { getByAltText, getByText } = render(
      <EmailSignature
        {...DEFAULT_PROPS}
        customProperties={[{ key: 'companyName', label: 'Company name', value: 'Example Company' }]}
        emailSignatureService={emailSignatureService}
        htmlTemplate={
          '<p>All the best, {{givenName}} - {{businessPhones}} - {{companyName}}</p><p><img alt="Portrait of {{givenName}}" height="65" src="{{image}}" width="65" /></p>'
        }
      />
    );

    await waitFor(() => {
      expect(emailSignatureService.getUserProfileProperties).toBeCalled();
      expect(emailSignatureService.getUserPhotoAsBase64).toBeCalled();
      expect(getByText(/Email signature/)).toBeInTheDocument();
      expect(getByText(/All the best/)).toBeInTheDocument();
      expect(getByText(/Tim/)).toBeInTheDocument();
      expect(getByText(/\+1-604-555-4567 x890/)).toBeInTheDocument();
      expect(getByText(/Example Company/)).toBeInTheDocument();
      expect(getByAltText(/Portrait of/)).toBeInTheDocument();
    });
  });

  test('error getting an profile properties back', async () => {
    const emailSignatureService = new EmailSignatureService(msGraphClient);

    (emailSignatureService.getUserProfileProperties as jest.Mock).mockImplementationOnce(() => {
      throw 'Error getting user profile properties';
    });

    const { getByText, queryByText } = render(
      <EmailSignature
        {...DEFAULT_PROPS}
        emailSignatureService={emailSignatureService}
        htmlTemplate={'<p>All the best, {{givenName}} - {{businessPhones}} - {{companyName}}</p>'}
      />
    );

    await waitFor(() => {
      expect(emailSignatureService.getUserProfileProperties).toBeCalled();
      expect(queryByText(/All the best/)).not.toBeInTheDocument();
      expect(getByText(/Sorry, an error occurred/)).toBeInTheDocument();
    });
  });

  test('error getting an image back', async () => {
    const emailSignatureService = new EmailSignatureService(msGraphClient);

    (emailSignatureService.getUserPhotoAsBase64 as jest.Mock).mockImplementationOnce(() => {
      throw 'Error getting image';
    });

    const { queryByText } = render(
      <EmailSignature
        {...DEFAULT_PROPS}
        emailSignatureService={emailSignatureService}
        htmlTemplate={'<p>All the best, {{givenName}} - {{businessPhones}} - {{companyName}}</p>'}
      />
    );

    await waitFor(() => {
      expect(emailSignatureService.getUserProfileProperties).toBeCalled();
      expect(queryByText(/All the best/)).not.toBeInTheDocument();
    });
  });

  test('adds circle mask to image', async () => {
    const emailSignatureService = new EmailSignatureService(msGraphClient);

    const { getByAltText } = render(
      <EmailSignature
        {...DEFAULT_PROPS}
        addCircleMask={true}
        emailSignatureService={emailSignatureService}
        htmlTemplate={`{{#image}}<img alt="Portrait of {{givenName}}" height="65" src="{{image}}" width="65" />{{/image}}`}
      />
    );

    await waitFor(() => {
      expect(emailSignatureService.getUserPhotoAsBase64).toBeCalled();
      expect(getByAltText(/Portrait of/)).toBeInTheDocument();
    });
  });

  test('hides editing features', async () => {
    const emailSignatureService = new EmailSignatureService(msGraphClient);

    const { getByText, queryByText } = render(
      <EmailSignature {...DEFAULT_PROPS} enableEditing={false} emailSignatureService={emailSignatureService} />
    );

    await waitFor(() => {
      expect(getByText(/Copy signature/)).toBeInTheDocument();
      expect(queryByText(/Edit signature/)).not.toBeInTheDocument();
    });
  });

  test('lowercases the email', async () => {
    const emailSignatureService = new EmailSignatureService(msGraphClient);

    const { getByText } = render(
      <EmailSignature
        {...DEFAULT_PROPS}
        emailSignatureService={emailSignatureService}
        forceLowercaseEmails={true}
        htmlTemplate={'<p>{{mail}}</p>'}
      />
    );

    await waitFor(() => {
      expect(getByText(/timjones@example.com/)).toBeInTheDocument();
    });
  });

  test('change value and see signature change', async () => {
    const emailSignatureService = new EmailSignatureService(msGraphClient);

    const { getByLabelText, getByText } = render(
      <EmailSignature {...DEFAULT_PROPS} emailSignatureService={emailSignatureService} htmlTemplate={'<p>Given name: {{givenName}}</p>'} />
    );

    await waitFor(() => {
      expect(getByText(/Given name: Tim/)).toBeInTheDocument();
    });

    fireEvent.click(getByText(/Edit signature/));

    const input = getByLabelText(/First name/) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'New first name' } });

    await waitFor(() => {
      expect(getByText(/Given name: New first name/)).toBeInTheDocument();
    });
  });
});
