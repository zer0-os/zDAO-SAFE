/// <reference types="react-scripts" />
declare module '*.svg' {
  const content: any;
  export default content;
}

interface Window {
  ethereum?: {
    isMetaMask?: true;
    request?: (...args: any[]) => Promise<void>;
  };
}
