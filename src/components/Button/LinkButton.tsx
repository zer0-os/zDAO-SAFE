import { Box, TextProps } from '@chakra-ui/react';
import React from 'react';
import { Link, To } from 'react-router-dom';

interface LinkButtonProps extends TextProps {
  to: To;
  isExternal?: boolean;
  children: React.ReactNode;
}

const LinkButton = ({
  to,
  isExternal = false,
  children,
  ...props
}: LinkButtonProps) => {
  return (
    <Box _hover={{ textDecoration: 'none' }} {...props}>
      <Link to={to} target={isExternal ? '_blank' : '_self'}>
        {children}
      </Link>
    </Box>
  );
};

export default LinkButton;
