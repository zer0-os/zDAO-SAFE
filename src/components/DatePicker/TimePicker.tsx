import { ReactDatePickerProps } from 'react-datepicker';
import { DatePicker } from '.';

const TimePicker = ({ ...props }: ReactDatePickerProps) => {
  return (
    <DatePicker
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption={'Time'}
      dateFormat={'ppp'}
      {...props}
    ></DatePicker>
  );
};

export default TimePicker;
