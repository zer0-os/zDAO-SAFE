import { Stack } from '@chakra-ui/react';
import React from 'react';

interface TimerProps extends React.HTMLAttributes<HTMLDivElement> {
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
}

const Timer = ({ seconds, minutes, hours, days, ...props }: TimerProps) => {
  return (
    <Stack direction="row" spacing={2} {...props}>
      {Boolean(days) && (
        <div {...props} className="pr-1">
          {`${days}`.padStart(2, '0')}
          <small>d</small>
        </div>
      )}
      <div {...props} className="pr-1">
        {`${hours}`.padStart(2, '0')}
        <small>h</small>
      </div>
      <div {...props} className="pr-1">
        {`${minutes}`.padStart(2, '0')}
        <small>m</small>
      </div>
      <div {...props} className="pr-1">
        {`${seconds}`.padStart(2, '0')}
        <small>s</small>
      </div>
    </Stack>
  );
};

export default Timer;
