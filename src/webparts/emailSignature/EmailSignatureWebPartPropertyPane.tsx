import { PropertyPaneTextField, type IPropertyPaneConfiguration, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import type { WebPartContext } from '@microsoft/sp-webpart-base';
import { PropertyFieldCodeEditor, PropertyFieldCodeEditorLanguages } from '@pnp/spfx-property-controls/lib/PropertyFieldCodeEditor';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';

import { EmailSignatureWebPartProps } from './types';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';

import * as strings from 'EmailSignatureWebPartStrings';

type WebPartPropertyPaneProps = {
  context: WebPartContext;
  onPropertyChange: (propertyPath: string, oldValue: any, newValue: any) => void;
  properties: EmailSignatureWebPartProps;
};

export class EmailSignatureWebPartPropertyPane {
  public getPropertyPaneConfiguration({ onPropertyChange, properties }: WebPartPropertyPaneProps): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.ContentGroupName,
              groupFields: [
                PropertyPaneTextField('webPartTitleText', {
                  label: strings.WebPartTitleFieldLabel
                }),
                PropertyFieldCodeEditor('htmlTemplate', {
                  initialValue: properties.htmlTemplate,
                  key: 'HtmlTemplateFieldKey',
                  label: strings.HtmlTemplateFieldLabel,
                  language: PropertyFieldCodeEditorLanguages.HTML,
                  onPropertyChange: onPropertyChange,
                  panelTitle: strings.HtmlTemplateFieldLabel,
                  properties: properties
                }),
                PropertyFieldCollectionData('customProperties', {
                  disabled: false,
                  fields: [
                    {
                      id: 'key',
                      title: strings.KeyCollectionLabel,
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: 'label',
                      title: strings.LabelCollectionLabel,
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: 'value',
                      title: strings.ValueCollectionLabel,
                      type: CustomCollectionFieldType.string,
                      required: false
                    },
                    {
                      id: 'editable',
                      title: strings.UserEditableCollectionLabel,
                      type: CustomCollectionFieldType.boolean
                    }
                  ],
                  key: 'CustomPropertiesFieldKey',
                  label: strings.CustomPropertyCollectionLabel,
                  manageBtnLabel: strings.CustomPropertyManageButton,
                  panelHeader: strings.CustomPropertyCollectionLabel,
                  value: properties.customProperties
                })
              ]
            },
            {
              groupName: 'Image details',
              groupFields: [
                PropertyPaneToggle('addCircleMask', {
                  label: strings.AddCircleMaskFieldLabel
                }),
                PropertyFieldNumber('imageSize', {
                  key: 'PropertyFieldNumberKey',
                  label: strings.ImageSizeFieldLabel,
                  minValue: 1,
                  value: properties.imageSize
                })
              ]
            },
            {
              groupName: 'Settings',
              groupFields: [
                PropertyPaneToggle('enableEditing', {
                  label: strings.EnableEditingFieldLabel
                }),
                PropertyPaneToggle('forceLowercaseEmails', {
                  label: strings.ForceLowercaseEmailsFieldLabel
                }),
                PropertyPaneToggle('copyAsHtml', {
                  label: strings.CopyAsHtmlFieldLabel
                }),
                PropertyPaneToggle('downloadHtml', {
                  label: strings.DownloadAsHtmlFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
