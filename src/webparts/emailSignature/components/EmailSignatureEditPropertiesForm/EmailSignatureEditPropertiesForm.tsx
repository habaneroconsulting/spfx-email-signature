/** @jsx jsx */

import { Fragment, useCallback, useState } from 'react';

import { jsx } from '@emotion/react';
import { ActionButton } from '@fluentui/react/lib/Button';
import { Panel } from '@fluentui/react/lib/Panel';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';

import * as strings from 'EmailSignatureWebPartStrings';
import { USER_PROPERTIES_MAPPING } from '../../constants';
import { EmailSignatureCustomProperty, EmailSignatureWebPartProps } from '../../types';

type EmailSignatureEditPropertiesFormProps = Pick<EmailSignatureWebPartProps, 'customProperties' | 'htmlTemplate'> & {
  editProperty: (property: EmailSignatureCustomProperty, newValue: string) => void;
  profileProperties: { [k: string]: string };
};

export const EmailSignatureEditPropertiesForm = ({
  customProperties,
  editProperty,
  htmlTemplate,
  profileProperties
}: EmailSignatureEditPropertiesFormProps) => {
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  const openEditPropertiesPanel = () => setIsEditPanelOpen(true);

  const closeEditPropertiesPanel = () => setIsEditPanelOpen(false);

  return (
    <Fragment>
      <ActionButton iconProps={{ iconName: 'Edit' }} onClick={openEditPropertiesPanel}>
        {strings.EditValuesButton}
      </ActionButton>

      <Panel
        headerText={strings.EditValuesButton}
        isOpen={isEditPanelOpen}
        onDismiss={closeEditPropertiesPanel}
        closeButtonAriaLabel={strings.CloseButton}
      >
        <Stack tokens={{ childrenGap: 8 }}>
          {[...USER_PROPERTIES_MAPPING, ...customProperties]
            // Only show properties in the template.
            .filter((property) => htmlTemplate.indexOf(property.key) > -1)
            // If the property has no editable property, that defaults to true.
            .filter((property) => property.editable !== false)
            .map((property) => (
              <TextField
                css={{
                  label: 'text-field'
                }}
                defaultValue={profileProperties[property.key]}
                key={`user-property-text-field-${property.key}`}
                label={property.label}
                onChange={(_e, newValue) => editProperty(property, newValue)}
              />
            ))}
        </Stack>
      </Panel>
    </Fragment>
  );
};

EmailSignatureEditPropertiesForm.displayName = 'EmailSignatureEditPropertiesForm';
