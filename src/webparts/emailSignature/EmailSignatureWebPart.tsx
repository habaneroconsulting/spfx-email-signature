import React from 'react';
import ReactDom from 'react-dom';

import { IReadonlyTheme, ThemeChangedEventArgs, ThemeProvider } from '@microsoft/sp-component-base';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'EmailSignatureWebPartStrings';
import { EmailSignature } from './components/EmailSignature/EmailSignature';
import { EmailSignatureService } from './services/EmailSignatureService';
import { IEmailSignatureService } from './services/IEmailSignatureService';
import { LocalEmailSignatureService } from './services/LocalEmailSignatureService';
import { EmailSignatureWebPartProps } from './types';

export default class EmailSignatureWebPart extends BaseClientSideWebPart<EmailSignatureWebPartProps> {
  private _emailSignatureService: IEmailSignatureService;
  private _themeProvider?: ThemeProvider;
  private _themeVariant?: IReadonlyTheme | undefined;

  // Dynamically loaded property fields.
  private _CustomCollectionFieldType: any;
  private _PropertyFieldCodeEditor: any;
  private _PropertyFieldCollectionData: any;
  private _PropertyFieldNumber: any;

  /**
   * Get theme, Microsoft Graph values.
   */
  protected async onInit() {
    // Get the current SharePoint theme and re-render on theme changes.
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);
    this._themeVariant = this._themeProvider?.tryGetTheme();

    const msGraphClient = await this.context.msGraphClientFactory.getClient('3');

    this._emailSignatureService = new EmailSignatureService(msGraphClient);

    if (DEBUG) {
      if (Environment.type === EnvironmentType.Local) {
        this._emailSignatureService = new LocalEmailSignatureService();
      }
    }

    return super.onInit();
  }

  public async render() {
    ReactDom.render(
      <EmailSignature
        displayMode={this.displayMode}
        emailSignatureService={this._emailSignatureService}
        themeVariant={this._themeVariant}
        updateWebPartTitleText={this._updateWebPartTitleText.bind(this)}
        {...this.properties}
      />,
      this.domElement
    );
  }

  /**
   * Dynamically load code editor, collection data editor when the web part edit panel opens.
   */
  protected async loadPropertyPaneResources() {
    const { PropertyFieldCodeEditor } = await import(
      /* webpackChunkName: 'emailsignature-propertyfieldcodeeditor' */
      '@pnp/spfx-property-controls/lib/PropertyFieldCodeEditor'
    );

    this._PropertyFieldCodeEditor = PropertyFieldCodeEditor;

    const { CustomCollectionFieldType, PropertyFieldCollectionData } = await import(
      /* webpackChunkName: 'emailsignature-propertyfieldcollectiondata' */
      '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData'
    );

    this._CustomCollectionFieldType = CustomCollectionFieldType;
    this._PropertyFieldCollectionData = PropertyFieldCollectionData;

    const { PropertyFieldNumber } = await import(
      /* webpackChunkName: 'emailsignature-propertyfieldnumber' */
      '@pnp/spfx-property-controls/lib/PropertyFieldNumber'
    );

    this._PropertyFieldNumber = PropertyFieldNumber;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                this._PropertyFieldCodeEditor('htmlTemplate', {
                  initialValue: this.properties.htmlTemplate,
                  key: 'HtmlTemplateFieldKey',
                  label: strings.HtmlTemplateFieldLabel,
                  language: 'html', // PropertyFieldCodeEditorLanguages.HTML
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  panelTitle: strings.HtmlTemplateFieldLabel,
                  properties: this.properties
                }),
                this._PropertyFieldCollectionData('customProperties', {
                  disabled: false,
                  fields: [
                    {
                      id: 'key',
                      title: strings.KeyCollectionLabel,
                      type: this._CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: 'label',
                      title: strings.LabelCollectionLabel,
                      type: this._CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: 'value',
                      title: strings.ValueCollectionLabel,
                      type: this._CustomCollectionFieldType.string,
                      required: false
                    },
                    {
                      id: 'editable',
                      title: strings.UserEditableCollectionLabel,
                      type: this._CustomCollectionFieldType.boolean
                    }
                  ],
                  key: 'CustomPropertiesFieldKey',
                  label: strings.CustomPropertyCollectionLabel,
                  manageBtnLabel: strings.CustomPropertyManageButton,
                  panelHeader: strings.CustomPropertyCollectionLabel,
                  value: this.properties.customProperties
                })
              ]
            },
            {
              groupName: 'Image details',
              groupFields: [
                PropertyPaneToggle('addCircleMask', {
                  label: strings.AddCircleMaskFieldLabel
                }),
                this._PropertyFieldNumber('imageSize', {
                  key: 'PropertyFieldNumberKey',
                  label: strings.ImageSizeFieldLabel,
                  minValue: 1,
                  value: this.properties.imageSize
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
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  /**
   * Re-render the component when theme variants change.
   */
  private _handleThemeChangedEvent(args: ThemeChangedEventArgs) {
    this._themeVariant = args.theme;

    this.render();
  }

  /**
   * Callback used for `<WebPartTitle>` component.
   */
  private _updateWebPartTitleText(value: string) {
    this.properties.webPartTitleText = value;
  }
}
