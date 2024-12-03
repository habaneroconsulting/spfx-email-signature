/** @jsx jsx */

import { jsx } from '@emotion/react';
import { DisplayMode } from '@microsoft/sp-core-library';
import { useRef, useState, useEffect } from 'react';

import { EmailSignatureWebPartProps } from '../../types';
import * as strings from 'EmailSignatureWebPartStrings';

type EmailSignatureWebPartTitleProps = Pick<EmailSignatureWebPartProps, 'webPartTitleText'> & {
  displayMode: DisplayMode;
  updateWebPartTitleText: (value: string) => void;
};

export const EmailSignatureWebPartTitle = ({
  displayMode = DisplayMode.Read,
  updateWebPartTitleText,
  webPartTitleText
}: EmailSignatureWebPartTitleProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [webPartTitle, setWebPartTitle] = useState(webPartTitleText);

  /**
   * On text changes, run the update property callback and then re-calculate
   * how tall the textarea should be.
   */
  const onTextareaChange = (textarea: HTMLTextAreaElement) => {
    if (updateWebPartTitleText) {
      const value = textarea.value;

      updateWebPartTitleText(value);
      setWebPartTitle(value);
    }

    textarea.style.removeProperty('height');
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    setWebPartTitle(webPartTitleText);
  }, [webPartTitleText]);

  // Don't render anything if in read mode and title is empty
  if (displayMode === DisplayMode.Read && (!webPartTitleText || webPartTitleText.trim().length === 0)) {
    return null;
  }

  return (
    <div
      css={{
        alignItems: 'baseline',
        display: 'flex'
      }}
    >
      <div
        css={{
          flexGrow: 1,
          marginBlockEnd: '12px',
          marginInlineEnd: '32px'
        }}
      >
        {webPartTitle && (displayMode === DisplayMode.Read || !updateWebPartTitleText) && (
          <h2
            css={{
              fontWeight: 600,
              marginBlock: 0,
              minHeight: 23
            }}
          >
            {webPartTitle}
          </h2>
        )}

        {displayMode === DisplayMode.Edit && updateWebPartTitleText && (
          <textarea
            aria-label={strings.WebPartTitleFieldLabel}
            css={{
              background: 'transparent',
              border: 0,
              fontFamily:
                "'Segoe UI','Segoe UI Web (West European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif",
              fontSize: 20,
              fontWeight: 600,
              label: 'web-part-title-textarea',
              lineHeight: 1.2,
              height: '1.2em',
              margin: 0,
              overflowY: 'hidden',
              padding: 0,
              resize: 'none',
              width: '100%'
            }}
            onChange={(e) => onTextareaChange(e.currentTarget)}
            ref={textareaRef}
            value={webPartTitle}
          />
        )}
      </div>
    </div>
  );
};

EmailSignatureWebPartTitle.displayName = 'EmailSignatureWebPartTitle';
