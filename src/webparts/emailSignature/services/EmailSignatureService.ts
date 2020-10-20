import { MSGraphClient } from '@microsoft/sp-http';

import { IEmailSignatureService } from './IEmailSignatureService';

export class EmailSignatureService implements IEmailSignatureService {
  private _msGraphClient: MSGraphClient;

  constructor(msGraphClient: MSGraphClient) {
    this._msGraphClient = msGraphClient;
  }

  public getUserProfileProperties(properties: string[]): Promise<{ [k: string]: string | string[] }> {
    return this._msGraphClient.api('/me').select(properties).get();
  }

  /**
   * Convert the user photo to base64. This helps in unit testing since creating
   * URLs from blobs is not possible in Jest. This MS Graph call will fail if a
   * user does not have a photo.
   */
  public async getUserPhotoAsBase64(): Promise<string> {
    const blob = await this._msGraphClient.api('/me/photo/$value').responseType('blob').get();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        resolve(reader.result.toString());
      };
    });
  }
}
