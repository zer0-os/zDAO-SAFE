import { Image, ImageProps } from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';
import React, { useEffect, useState } from 'react';

const address = '0x000000000000000000000000000000000000dead';

interface BlockieProps extends ImageProps {
  seed: string;
}

const Blockie = ({ seed, ...props }: BlockieProps) => {
  const [blockie, setBlockie] = useState('');

  useEffect(() => {
    setBlockie(makeBlockie(seed || address));
  }, [seed]);

  return <Image src={blockie} {...props} />;
};

export default Blockie;
