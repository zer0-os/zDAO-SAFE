import useNextEventCountDown from '@/hooks/useNextEventCountDown';
import getTimePeriods from '@/utils/getTimePeriods';
import { Text } from '@chakra-ui/react';
import Timer from './Timer';

interface EventCountDownProps {
  nextEventTime: number;
  headerText?: string;
  headerFontSize?: string;
  postCountDownText?: string;
  titleFontSize?: string;
  timerFontSize?: string;
  waiting?: string;
}

const EventCountDown = ({
  nextEventTime,
  postCountDownText,
  waiting = 'Waiting...',
}: EventCountDownProps) => {
  const secondsRemaining = useNextEventCountDown(nextEventTime);
  const { days, hours, minutes, seconds } = getTimePeriods(secondsRemaining);

  return (
    <div>
      {secondsRemaining ? (
        <>
          <Timer
            className="pb-1"
            seconds={seconds}
            minutes={minutes}
            hours={hours}
            days={days}
          />
          <Text>{postCountDownText || '\u00A0'}</Text>
        </>
      ) : (
        <Text>{waiting}</Text>
      )}
    </div>
  );
};

export default EventCountDown;
