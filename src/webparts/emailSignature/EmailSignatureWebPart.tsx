import React from 'react';
import ReactDom from 'react-dom';

import { IReadonlyTheme, ThemeChangedEventArgs, ThemeProvider } from '@microsoft/sp-component-base';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { EmailSignature } from './components/EmailSignature/EmailSignature';
import { EmailSignatureService } from './services/EmailSignatureService';
import { IEmailSignatureService } from './services/IEmailSignatureService';
import { LocalEmailSignatureService } from './services/LocalEmailSignatureService';
import { EmailSignatureWebPartProps } from './types';
import type { EmailSignatureWebPartPropertyPane } from './EmailSignatureWebPartPropertyPane';

export default class EmailSignatureWebPart extends BaseClientSideWebPart<EmailSignatureWebPartProps> {
  private _emailSignatureService: IEmailSignatureService;
  private _themeProvider?: ThemeProvider;
  private _themeVariant?: IReadonlyTheme | undefined;

  // Dynamically loaded property fields.
  private _DeferredPropertyPane: EmailSignatureWebPartPropertyPane;

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

  protected async loadPropertyPaneResources() {
    super.loadPropertyPaneResources();

    const component = await import(
      /* webpackChunkName: 'EmailSignatureWebPartPropertyPane'*/
      './EmailSignatureWebPartPropertyPane'
    );

    this._DeferredPropertyPane = new component.EmailSignatureWebPartPropertyPane();
  }

  protected getPropertyPaneConfiguration() {
    return this._DeferredPropertyPane.getPropertyPaneConfiguration({
      context: this.context,
      onPropertyChange: (propertyPath, oldValue, newValue) => {
        this.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
      },
      properties: this.properties
    });
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
