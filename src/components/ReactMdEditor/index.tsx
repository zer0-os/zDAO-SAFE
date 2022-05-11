import 'react-mde/lib/styles/css/react-mde-all.css';

import { Box, BoxProps, useColorMode } from '@chakra-ui/react';
import React, { useState } from 'react';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import styled from 'styled-components';

interface ReactMdeProps extends Omit<BoxProps, 'onChange'> {
  body: string;
  onChange: (text: string) => void;
}

const Wrapper = styled(Box)<{ theme: any }>`
  width: 100%;
  .react-mde {
    border-color: ${({ theme }) =>
      theme === 'dark'
        ? 'var(--chakra-colors-gray-600)'
        : 'var(--chakra-colors-gray-200)'};
    border-radius: var(--chakra-radii-md);
  }
  .mde-header {
    background: ${({ theme }) =>
      theme === 'dark'
        ? 'var(--chakra-colors-whiteAlpha-200)'
        : 'var(--chakra-colors-gray-100)'};
    border-radius: var(--chakra-radii-md) var(--chakra-radii-md) 0 0;
    border-color: ${({ theme }) =>
      theme === 'dark'
        ? 'var(--chakra-colors-gray-600)'
        : 'var(--chakra-colors-gray-200)'};
  }
  .mde-header .mde-tabs button {
    padding: 2px 10px;
  }
  .mde-header .mde-tabs button.selected {
    border-color: ${({ theme }) =>
      theme === 'dark'
        ? 'var(--chakra-colors-gray-600)'
        : 'var(--chakra-colors-gray-200)'};
  }
  .mde-header ul.mde-header-group li.mde-header-item button {
    color: ${({ theme }) =>
      theme === 'dark' ? 'white' : 'var(--chakra-colors-gray-600)'};
  }
  .mde-textarea-wrapper textarea.mde-text {
    background: transparent;
  }
  .mde-textarea-wrapper textarea:focus {
    box-shadow: 0 0 0 5px var(--chakra-colors-gray-600);
  }
`;

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const ReactMdEditor = ({ body, onChange, ...props }: ReactMdeProps) => {
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const { colorMode } = useColorMode();

  return (
    <Wrapper {...props} theme={colorMode}>
      <ReactMde
        value={body}
        onChange={onChange}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown: unknown) => {
          return Promise.resolve(converter.makeHtml(markdown));
        }}
        childProps={{
          writeButton: {
            tabIndex: -1,
          },
        }}
      />
    </Wrapper>
  );
};

export default ReactMdEditor;
