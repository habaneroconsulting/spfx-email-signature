/** @jsx jsx */

import { useCallback } from 'react';

import { jsx } from '@emotion/react';
import { ActionButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';

import * as strings from 'EmailSignatureWebPartStrings';

type EmailSignatureDownloadHtmlButtonProps = {
  html: string;
};

export const EmailSignatureDownloadHtmlButton = ({ html }: EmailSignatureDownloadHtmlButtonProps) => {
  const download = useCallback(() => {
    const blob = new Blob([html], { type: 'text/html' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Signature.html';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(a.href), 100);
  }, [html]);

  return (
    <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
      <ActionButton iconProps={{ iconName: 'Download' }} onClick={download}>
        {strings.DownloadAsHtmlButton}
      </ActionButton>
    </Stack>
  );
};

EmailSignatureDownloadHtmlButton.displayName = 'EmailSignatureDownloadHtmlButton';
