import React from 'react';
import ReactMarkdownLib from 'react-markdown';
import gfm from 'remark-gfm';

import markdownComponents from './styles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactMarkdown = (props: any) => {
  return (
    <ReactMarkdownLib
      remarkPlugins={[gfm]}
      components={markdownComponents}
      {...props}
    />
  );
};

export default ReactMarkdown;
