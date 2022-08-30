export const shorten = (str: string, limit: number) => {
  return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
};

const MINUTE_IN_SECONDS = 60;
const HOUR_IN_SECONDS = 3600;
const DAY_IN_SECONDS = 86400;

export const time2string = (seconds?: number) => {
  if (!seconds) return '---';

  const split = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (seconds >= DAY_IN_SECONDS) {
    split.days = Math.floor(seconds / DAY_IN_SECONDS);
    seconds -= split.days * DAY_IN_SECONDS;
  }

  if (seconds >= HOUR_IN_SECONDS) {
    split.hours = Math.floor(seconds / HOUR_IN_SECONDS);
    seconds -= split.hours * HOUR_IN_SECONDS;
  }

  if (seconds >= MINUTE_IN_SECONDS) {
    split.minutes = Math.floor(seconds / MINUTE_IN_SECONDS);
    seconds -= split.minutes * MINUTE_IN_SECONDS;
  }

  split.seconds = seconds;

  const sdays =
    split.days > 0 ? `${`${split.days}`.padStart(2, '0')}days ` : '';
  const shours =
    split.hours > 0 ? `${`${split.hours}`.padStart(2, '0')}hours ` : '';
  const sminutes =
    split.minutes > 0 ? `${`${split.minutes}`.padStart(2, '0')}mins ` : '';
  const sseconds =
    split.seconds > 0 ? `${`${split.seconds}`.padStart(2, '0')}seconds ` : '';

  return sdays + shours + sminutes + sseconds;
};
