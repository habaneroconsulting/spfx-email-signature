export interface IEmailSignatureService {
  getUserProfileProperties(properties: string[]): Promise<{ [k: string]: string | string[] }>;
  getUserPhotoAsBase64(): Promise<string>;
}
