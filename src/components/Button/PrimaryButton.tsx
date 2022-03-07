import { Button, ButtonProps, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const PrimaryButton = ({ children, ...props }: PrimaryButtonProps) => {
  return (
    <Button
      backgroundColor={useColorModeValue('blue.500', 'rgba(145, 85, 230, 0.2)')}
      borderWidth={'1px'}
      borderColor={useColorModeValue('blue.100', 'rgb(145, 85, 230)')}
      boxShadow={
        '0 0 80px rgb(192 219 255 / 50%), 0 0 32px rgb(65 120 255 / 10%)'
      }
      className={'slower ease-in-out'}
      color={useColorModeValue('gray.100', 'rgba(211, 187, 245, 0.8)')}
      textShadow={
        '0 0 80px rgb(192 219 255 / 65%), 0 0 32px rgb(65 120 255 / 20%)'
      }
      _hover={{
        backgroundColor: useColorModeValue(
          'blue.300',
          'rgba(145, 85, 230, 0.7)'
        ),
        color: useColorModeValue('gray.100', 'rgba(255, 255, 255, 0.7)'),
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
