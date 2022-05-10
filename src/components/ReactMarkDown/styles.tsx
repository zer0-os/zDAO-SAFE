import { Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { Components } from 'react-markdown/lib/ast-to-react';
import styled from 'styled-components';

const Table = styled.table`
  margin-bottom: 32px;
  margin-top: 32px;
  width: 100%;

  td,
  th {
    padding: 8px;
  }
`;
const TableBox = styled.div`
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

const ThemedComponent = styled.div`
  margin-bottom: 16px;
  margin-top: 16px;

  li {
    margin-bottom: 8px;
  }
`;

const Pre = styled.pre`
  margin-bottom: 16px;
  margin-top: 16px;
  max-width: 100%;
  overflow-x: auto;
`;

const AStyle = styled.a`
  word-break: break-all;
`;

const Title = ({...props}) => {
  return <Heading as="h4" fontSize={'2xl'} scale="lg" my="16px" {...props} />;
};

const markdownComponents: Partial<Components> = {
  h1: Title,
  h2: Title,
  h3: Title,
  h4: Title,
  h5: Title,
  h6: Title,
  p: (props) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <Text as="p" my="16px" {...props} />;
  },
  table: ({ ...props }) => {
    return (
      <TableBox>
        <Table>{props.children}</Table>
      </TableBox>
    );
  },
  ol: (props) => {
    return (
      <ThemedComponent
        as="ol"
        style={{ listStyle: 'inside disc' }}
        {...props}
      />
    );
  },
  ul: (props) => {
    return (
      <ThemedComponent
        as="ul"
        style={{ listStyle: 'inside disc' }}
        {...props}
      />
    );
  },
  a: (props) => {
    return <AStyle {...props} />;
  },
  pre: (props) => {
    return <Pre {...props} />;
  },
};

export default markdownComponents;
