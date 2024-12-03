/** @jsx jsx */

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';
import { Stack } from '@fluentui/react/lib/Stack';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { DisplayMode, Log } from '@microsoft/sp-core-library';
import { debounce } from '@microsoft/sp-lodash-subset';
import Mustache from 'mustache';

import * as strings from 'EmailSignatureWebPartStrings';
import { USER_PROPERTIES } from '../../constants';
import { IEmailSignatureService } from '../../services/IEmailSignatureService';
import { EmailSignatureCustomProperty, EmailSignatureWebPartProps } from '../../types';
import { optimizeImage } from '../../utilities/optimize-image';

import { EmailSignatureCopyButton } from '../EmailSignatureCopyButton/EmailSignatureCopyButton';
import { EmailSignatureEditPropertiesForm } from '../EmailSignatureEditPropertiesForm/EmailSignatureEditPropertiesForm';
import { EmailSignatureLoadingScreen } from '../EmailSignatureLoadingScreen/EmailSignatureLoadingScreen';
import { EmailSignatureTemplate } from '../EmailSignatureTemplate/EmailSignatureTemplate';
import { EmailSignatureWebPartTitle } from '../EmailSignatureWebPartTitle/EmailSignatureWebPartTitle';
import { EmailSignatureDownloadHtmlButton } from '../EmailSignatureDownloadHtmlButton/EmailSignatureDownloadHtmlButton';

enum EmailSignatureStatus {
  Initial = 'initial',
  Loading = 'loading',
  Error = 'error',
  Success = 'success'
}

type EmailSignatureProfileProperties = { [k: string]: string };

type EmailSignatureProps = EmailSignatureWebPartProps & {
  displayMode: DisplayMode;
  emailSignatureService: IEmailSignatureService;
  themeVariant?: IReadonlyTheme;
  updateWebPartTitleText: (value: string) => void;
};

type EmailSignatureState =
  | { status: EmailSignatureStatus.Initial }
  | { status: EmailSignatureStatus.Loading }
  | { status: EmailSignatureStatus.Error }
  | { status: EmailSignatureStatus.Success; profileProperties: EmailSignatureProfileProperties; profileImage: string };

export const EmailSignature = ({
  addCircleMask,
  copyAsHtml,
  customProperties,
  downloadHtml,
  displayMode,
  emailSignatureService,
  enableEditing,
  forceLowercaseEmails,
  htmlTemplate,
  imageSize,
  themeVariant,
  updateWebPartTitleText,
  webPartTitleText
}: EmailSignatureProps) => {
  const [state, setState] = useState<EmailSignatureState>({ status: EmailSignatureStatus.Initial });

  // Get profile data, profile image.
  useEffect(() => {
    const fetchData = async () => {
      // Get the current user's profile properties.
      let profileProperties = await emailSignatureService.getUserProfileProperties(USER_PROPERTIES);

      // The `businessPhones` property is an array, so take the first value of any array item.
      for (const key in profileProperties) {
        const value = profileProperties[key];

        if (Array.isArray(value)) {
          [profileProperties[key]] = value;
        } else {
          profileProperties[key] = value;
        }
      }

      // Merge custom properties and retrieved profile properties together.
      const reducedProfileProperties = customProperties.reduce((previousProperties, currentProperty) => {
        previousProperties[currentProperty.key] = currentProperty.value;

        return previousProperties;
      }, profileProperties) as EmailSignatureProfileProperties;

      // Attempt to get the user photo.
      let profileImageSrc: string = null;

      // If a user does not have a photo, this call fails.
      try {
        profileImageSrc = await emailSignatureService.getUserPhotoAsBase64();
      } catch (e) {
        Log.warn('EmailSignatureWebPart', `An error occurred retrieving the photo. User may not have a photo.`);
      }

      let profileImage: string = null;

      if (profileImageSrc) {
        profileImage = await optimizeImage(profileImageSrc, imageSize, addCircleMask);
      }

      setState({
        status: EmailSignatureStatus.Success,
        profileProperties: reducedProfileProperties,
        profileImage
      });
    };

    fetchData().catch((e) => {
      Log.error('EmailSignatureWebPart', e);

      setState({ status: EmailSignatureStatus.Error });
    });
  }, [addCircleMask, imageSize]);

  // Generate the HTML email template
  const html = useMemo(() => {
    if (state.status !== EmailSignatureStatus.Success) {
      return;
    }

    const currentProfileProperties = state.profileProperties;

    if (forceLowercaseEmails && currentProfileProperties?.mail) {
      currentProfileProperties.mail = currentProfileProperties.mail.toLowerCase();
    }

    currentProfileProperties.image = state.profileImage;

    return Mustache.render(htmlTemplate, currentProfileProperties);
  }, [forceLowercaseEmails, htmlTemplate, state]);

  // Update the user properties when changes occur in the form.
  const editProperty = useCallback(
    debounce((property: EmailSignatureCustomProperty, newValue: string) => {
      setState((prevState) => {
        if (prevState.status == EmailSignatureStatus.Success) {
          return {
            ...prevState,
            profileProperties: {
              ...prevState.profileProperties,
              [property.key]: newValue
            }
          };
        }
      });
    }, 100),
    []
  );

  if (state.status === EmailSignatureStatus.Initial || state.status === EmailSignatureStatus.Loading) {
    return <EmailSignatureLoadingScreen themeVariant={themeVariant} />;
  }

  if (state.status === EmailSignatureStatus.Error) {
    return (
      <Fragment>
        <EmailSignatureWebPartTitle displayMode={DisplayMode.Read} updateWebPartTitleText={() => {}} webPartTitleText={webPartTitleText} />
        <p>{strings.ErrorMessage}</p>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <EmailSignatureWebPartTitle
        displayMode={displayMode}
        updateWebPartTitleText={updateWebPartTitleText}
        webPartTitleText={webPartTitleText}
      />

      <EmailSignatureTemplate html={html} themeVariant={themeVariant} />

      <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
        {enableEditing && (
          <Stack.Item>
            <EmailSignatureEditPropertiesForm
              customProperties={customProperties}
              editProperty={editProperty}
              htmlTemplate={htmlTemplate}
              profileProperties={state.profileProperties}
            />
          </Stack.Item>
        )}

        {downloadHtml && (
          <Stack.Item>
            <EmailSignatureDownloadHtmlButton html={html} />
          </Stack.Item>
        )}

        <Stack.Item>
          <EmailSignatureCopyButton copyAsHtml={copyAsHtml} html={html} themeVariant={themeVariant} />
        </Stack.Item>
      </Stack>
    </Fragment>
  );
};

EmailSignature.displayName = 'EmailSignature';
