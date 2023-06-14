/** @jsx jsx */

import { useCallback, useState } from 'react';

import { jsx } from '@emotion/react';
import { ActionButton } from '@fluentui/react/lib/Button';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { Stack } from '@fluentui/react/lib/Stack';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { Transition } from 'react-transition-group';

import * as strings from 'EmailSignatureWebPartStrings';

type EmailSignatureCopyButtonProps = {
  html: string;
  themeVariant?: IReadonlyTheme;
};

export const EmailSignatureCopyButton = ({ html, themeVariant }: EmailSignatureCopyButtonProps) => {
  const [showCopySuccessMessage, setShowCopySuccessMessage] = useState(false);

  // Copy the signature as rich text.
  const copySignature = useCallback(async () => {
    const { ClipboardItem, write } = await import(/* webpackChunkName: "emailsignature-clipboard-polyfill" */ 'clipboard-polyfill');

    const item = new ClipboardItem({
      'text/html': html
    });

    await write([item]);

    // Show `Copied!` for a moment.
    setShowCopySuccessMessage(true);
  }, [html]);

  const removeCopySuccessMessage = useCallback(() => setShowCopySuccessMessage(false), []);

  return (
    <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
      <ActionButton iconProps={{ iconName: 'Copy' }} onClick={copySignature}>
        {strings.CopySignatureButton}
      </ActionButton>

      <Transition in={showCopySuccessMessage} onEntered={removeCopySuccessMessage} timeout={{ enter: 2500, exit: 500 }}>
        {(state: string) => {
          const transitionStyles: any = {
            entering: {},
            entered: {},
            exiting: { opacity: 0, transition: `opacity 500ms ease-in-out` },
            exited: { opacity: 0 }
          };

          return (
            <Stack
              aria-hidden={!showCopySuccessMessage}
              aria-live="assertive"
              horizontal
              styles={{
                root: {
                  opacity: 1,
                  padding: '0 4px',
                  ...transitionStyles[state]
                }
              }}
              tokens={{ childrenGap: 8 }}
              role="alert"
              verticalAlign="center"
            >
              <FontIcon css={{ color: themeVariant.semanticColors.primaryButtonBackground }} iconName="SkypeCircleCheck" />

              <span>{strings.CopySignatureSuccessButton}</span>
            </Stack>
          );
        }}
      </Transition>
    </Stack>
  );
};

EmailSignatureCopyButton.displayName = 'EmailSignatureCopyButton';
