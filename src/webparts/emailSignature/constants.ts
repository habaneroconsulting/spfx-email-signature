import { EmailSignatureCustomProperty } from './types';

import * as strings from 'EmailSignatureWebPartStrings';

export const USER_PROPERTIES = [
  'businessPhones',
  'city',
  'country',
  'department',
  'displayName',
  'givenName',
  'jobTitle',
  'mail',
  'mobilePhone',
  'officeLocation',
  'postalCode',
  'preferredLanguage',
  'state',
  'streetAddress',
  'surname'
];

export const USER_PROPERTIES_MAPPING: EmailSignatureCustomProperty[] = [
  { key: 'displayName', label: strings.DisplayNameFormLabel },
  { key: 'givenName', label: strings.GivenNameFormLabel },
  { key: 'surname', label: strings.SurnameFormLabel },
  { key: 'jobTitle', label: strings.JobTitleFormLabel },
  { key: 'department', label: strings.DepartmentFormLabel },
  { key: 'businessPhones', label: strings.BusinessPhonesFormLabel },
  { key: 'mobilePhone', label: strings.MobilePhoneFormLabel },
  { key: 'mail', label: strings.MailFormLabel },
  { key: 'officeLocation', label: strings.OfficeLocationFormLabel },
  { key: 'streetAddress', label: strings.StreetAddressFormLabel },
  { key: 'city', label: strings.CityFormLabel },
  { key: 'state', label: strings.StateFormLabel },
  { key: 'country', label: strings.CountryFormLabel },
  { key: 'postalCode', label: strings.PostalCodeFormLabel }
];
