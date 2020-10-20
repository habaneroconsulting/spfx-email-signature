import { UserPhoto } from '../__mocks__/UserPhoto';
import { UserProfileProperties } from '../__mocks__/UserProfileProperties';
import { IEmailSignatureService } from './IEmailSignatureService';

export class LocalEmailSignatureService implements IEmailSignatureService {
  private _userProfileProperties = UserProfileProperties;

  constructor(userProfileProperties?: any) {
    if (userProfileProperties) {
      this._userProfileProperties = userProfileProperties;
    }
  }

  public getUserProfileProperties(properties: string[]): Promise<{ [k: string]: string | string[] }> {
    return new Promise((resolve) => {
      resolve(this._userProfileProperties);
    });
  }

  public getUserPhotoAsBase64(): Promise<string> {
    return new Promise((resolve) => {
      resolve(`data:image/jpeg;base64,${UserPhoto}`);
    });
  }
}
