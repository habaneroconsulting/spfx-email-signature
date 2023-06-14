import type { MSGraphClientV3 } from '@microsoft/sp-http';
import { ResponseType } from '@microsoft/microsoft-graph-client';

import { IEmailSignatureService } from './IEmailSignatureService';

export class EmailSignatureService implements IEmailSignatureService {
  private _msGraphClient: MSGraphClientV3;

  constructor(msGraphClient: MSGraphClientV3) {
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
    const blob = await this._msGraphClient.api('/me/photo/$value').responseType(ResponseType.BLOB).get();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        resolve(reader.result.toString());
      };
    });
  }
}
