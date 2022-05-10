import { Link, LinkProps } from '@chakra-ui/react';
import React from 'react';

interface LinkButtonProps extends LinkProps {
  children: React.ReactNode;
}

const LinkButton = ({ children, ...props }: LinkButtonProps) => {
  return (
    <Link _hover={{ textDecoration: 'none' }} {...props}>
      {children}
    </Link>
  );
};

export default LinkButton;
