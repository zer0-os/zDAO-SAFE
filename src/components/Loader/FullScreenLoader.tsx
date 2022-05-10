import React from 'react';

import Loader from './Loader';

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function FullScreenLoader({
  size = '32px',
  stroke = 'rgba(0,0,0,0.5)',
  ...rest
}: {
  size?: string;
  stroke?: string;
}) {
  return (
    <div className="position-relative vw-100 vh-100">
      <div className="position-absolute top-50 start-50 translate-middle">
        <Loader size={size} stroke={stroke} {...rest} />
      </div>
    </div>
  );
}
