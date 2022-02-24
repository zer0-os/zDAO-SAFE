import { Input } from '@chakra-ui/react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ ...props }: ReactDatePickerProps) => {
  return (
    <ReactDatePicker
      customInput={<Input />}
      dateFormat="PPP"
      portalId={'reactDatePicker'}
      {...props}
    ></ReactDatePicker>
  );
};

export default DatePicker;
