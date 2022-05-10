import React from 'react';
import ReactMarkdownLib from 'react-markdown';
import gfm from 'remark-gfm';

import markdownComponents from './styles';

const ReactMarkdown = ({...props}) => {
  return (
    <ReactMarkdownLib
      remarkPlugins={[gfm]}
      components={markdownComponents}
      {...props}
    />
  );
};

export default ReactMarkdown;
