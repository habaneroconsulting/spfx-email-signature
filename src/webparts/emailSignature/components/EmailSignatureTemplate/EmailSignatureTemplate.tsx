/** @jsx jsx */

import { jsx } from '@emotion/react';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

type EmailSignatureTemplateProps = {
  html: string;
  themeVariant?: IReadonlyTheme;
};

export const EmailSignatureTemplate = ({ html, themeVariant }: EmailSignatureTemplateProps) => {
  return (
    <div
      css={{
        label: 'email-signature-template-container',
        marginBottom: 12,
        width: '100%',

        [':last-child']: {
          marginBottom: 0
        }
      }}
    >
      <div
        css={{
          boxSizing: 'border-box',
          border: `1px solid ${themeVariant.palette.neutralLight}`,
          display: 'inline-block',
          label: 'email-signature-template',
          padding: 16,
          width: '100%'
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

EmailSignatureTemplate.displayName = 'EmailSignatureTemplate';
