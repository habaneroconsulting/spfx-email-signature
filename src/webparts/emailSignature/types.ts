export type EmailSignatureCustomProperty = {
  editable?: boolean;
  key: string;
  label: string;
  value?: string;
};

export type EmailSignatureWebPartProps = {
  addCircleMask: boolean;
  copyAsHtml: boolean;
  customProperties: EmailSignatureCustomProperty[];
  downloadHtml: boolean;
  enableEditing: boolean;
  forceLowercaseEmails: boolean;
  htmlTemplate: string;
  imageSize: number;
  webPartTitleText: string;
};
