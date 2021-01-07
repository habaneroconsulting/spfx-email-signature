/** @jsx jsx */

import { jsx } from '@emotion/react';
import { Shimmer } from '@fluentui/react/lib/Shimmer';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

type EmailSignatureLoadingScreenProps = {
  themeVariant?: IReadonlyTheme;
};

export const EmailSignatureLoadingScreen = ({ themeVariant }: EmailSignatureLoadingScreenProps) => {
  return (
    <div>
      <div css={{ marginBottom: 24 }}>
        <Shimmer height={23} width={140} />
      </div>

      <div
        css={{
          border: `1px solid ${themeVariant.palette.neutralLight}`,
          boxSizing: 'border-box',
          display: 'inline-block',
          label: 'email-signature-template-placeholder',
          marginBottom: 16,
          padding: 16,
          width: '100%'
        }}
      >
        <div css={{ display: 'grid', rowGap: 16 }}>
          <Shimmer height={23} width={260} />
          <Shimmer height={23} width={200} />
          <Shimmer height={23} width={230} />
        </div>
      </div>

      <div css={{ columnGap: 16, display: 'grid', gridTemplateColumns: '160px 180px' }}>
        <Shimmer height={23} width={160} />
        <Shimmer height={23} width={180} />
      </div>
    </div>
  );
};

EmailSignatureLoadingScreen.displayName = 'EmailSignatureLoadingScreen';
