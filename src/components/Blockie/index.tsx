import makeBlockie from 'ethereum-blockies-base64';
import React, { useEffect, useState } from 'react';
import { Image, ImageProps } from 'react-bootstrap';

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
