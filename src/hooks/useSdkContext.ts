import { useContext } from 'react';

import { SDKContext } from '@/contexts/SDKContext';

export const useSdkContext = () => {
  const sdk = useContext(SDKContext);
  if (!sdk) {
    throw new Error(
      'Make sure to only call useSdkContext within <SDKProvider>'
    );
  }

  return sdk;
};
