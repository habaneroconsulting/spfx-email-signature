/** @jsx jsx */

import { jsx } from '@emotion/core';
import { DisplayMode } from '@microsoft/sp-core-library';

import { EmailSignatureWebPartProps } from '../../types';

type EmailSignatureWebPartTitleProps = Pick<EmailSignatureWebPartProps, 'webPartTitleText'> & {
  displayMode: DisplayMode;
  updateWebPartTitleText: (value: string) => void;
};

export const EmailSignatureWebPartTitle = ({ displayMode, updateWebPartTitleText, webPartTitleText }: EmailSignatureWebPartTitleProps) => {
  return (
    <div css={{ marginBottom: 24 }}>
      {webPartTitleText && displayMode === DisplayMode.Read && (
        <h2 css={{ fontSize: 20, fontWeight: 600, margin: 0, minHeight: 23 }}>{webPartTitleText}</h2>
      )}

      {displayMode === DisplayMode.Edit && (
        <textarea
          css={{ border: 0, fontSize: 20, fontWeight: 600, margin: 0, minHeight: 23, padding: 0, resize: 'none' }}
          defaultValue={webPartTitleText}
          onChange={(e) => updateWebPartTitleText(e.target.value)}
          rows={1}
        />
      )}
    </div>
  );
};

EmailSignatureWebPartTitle.displayName = 'EmailSignatureWebPartTitle';
