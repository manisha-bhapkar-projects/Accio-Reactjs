/**
 * CustomDatePicker: We can create Date Picker with or without label  
 *    
 * 
      label: '', // label if we want to show 
      labelClass: 'date-picker-label', // for extra styling
      selectedDay: { // default date 
        year: '',
        month: '',
        day: '',
      },
      setSelectedDay: '', // function which handle date change 
      inputClass: 'date-picker-input', // className from input box
      isDisabled: false, // for enable or dissable 

 */
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-modern-calendar-datepicker';
import CalenderInactive from '../../images/calender/calendar-icon_inactive.png';
import CalenderActive from '../../images/calender/calendar-icon.png';
import editImg from '../../images/edit/edit.png';

// import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import './CustomDatePicker.scss';

const myCustomLocale = {
  // months list by order
  months: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],

  // week days by order
  weekDays: [
    {
      name: 'Sunday', // used for accessibility
      short: 'SUN', // displayed at the top of days' rows
      isWeekend: true, // is it a formal weekend or not?
    },
    {
      name: 'Monday',
      short: 'MON',
    },
    {
      name: 'Tuesday',
      short: 'TUE',
    },
    {
      name: 'Wednesday',
      short: 'WED',
    },
    {
      name: 'Thursday',
      short: 'THU',
    },
    {
      name: 'Friday',
      short: 'FRI',
    },
    {
      name: 'Saturday',
      short: 'SAT',
      isWeekend: true,
    },
  ],

  // just play around with this number between 0 and 6
  weekStartingIndex: 0,

  // return a { year: number, month: number, day: number } object
  getToday(gregorainTodayObject) {
    return gregorainTodayObject;
  },

  // return a native JavaScript date here
  toNativeDate(date) {
    return new Date(date.year, date.month - 1, date.day);
  },

  // return a number for date's month length
  getMonthLength(date) {
    return new Date(date.year, date.month, 0).getDate();
  },

  // return a transformed digit to your locale
  transformDigit(digit) {
    return digit;
  },

  // texts in the date picker
  nextMonth: 'Next Month',
  previousMonth: 'Previous Month',
  openMonthSelector: 'Open Month Selector',
  openYearSelector: 'Open Year Selector',
  closeMonthSelector: 'Close Month Selector',
  closeYearSelector: 'Close Year Selector',
  defaultPlaceholder: 'Select...',

  // for input range value
  from: 'from',
  to: 'to',

  // used for input value when multi dates are selected
  digitSeparator: ',',

  // if your provide -2 for example, year will be 2 digited
  yearLetterSkip: 0,

  // is your language rtl or ltr?
  isRtl: false,
};

// CustomDatePicker: we can create datepicker
const CustomDatePicker = props => {
  const {
    label,
    labelClass,
    selectedDay,
    setSelectedDay,
    inputClass,
    isDisabled,
    isEditIcon,
    editIconClick,
  } = props;

  // render regular HTML input element
  const renderCustomInput = ref => (
    <div className="d-flex flex-direction-row">
      <input
        readOnly
        ref={ref} // necessary
        placeholder="Select Date"
        disabled={isDisabled}
        value={
          selectedDay
            ? `${selectedDay.day}-${selectedDay.month}-${selectedDay.year}`
            : ''
        }
        className={`${inputClass} ${
          isDisabled ? 'date-picker-inactive' : 'date-picker-active'
        }`}
      />
      <div>
        <img
          alt="clender"
          className={`calender-icon ${!isDisabled ? 'cursor' : ''}`}
          src={isDisabled ? CalenderInactive : CalenderActive}
        />
      </div>
    </div>
  );

  return (
    <div className="date-picker">
      {label ? (
        <div className={labelClass || 'date-picker-label'}>{label}</div>
      ) : (
        ''
      )}
      <div className="d-flex justify-content-center">
        <DatePicker
          value={selectedDay}
          onChange={setSelectedDay}
          shouldHighlightWeekends
          renderInput={({ ref }) => renderCustomInput(ref)} // render a custom input
          locale={myCustomLocale}
        />
        {isEditIcon ? (
          <>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={null}
              className="datepicker-edit-icon"
              onClick={editIconClick}
            >
              <img alt="edit" className="cursor" src={editImg} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CustomDatePicker;

CustomDatePicker.defaultProps = {
  label: '',
  labelClass: 'date-picker-label',
  selectedDay: {
    year: '',
    month: '',
    day: '',
  },
  setSelectedDay: '',
  inputClass: 'date-picker-input',
  isDisabled: false,
  isEditIcon: false,
  editIconClick: null,
};

CustomDatePicker.propTypes = {
  label: PropTypes.string,
  labelClass: PropTypes.string,
  selectedDay: PropTypes.instanceOf(Object), // PropTypes.instanceof(Object)
  setSelectedDay: PropTypes.func,
  inputClass: PropTypes.string,
  isDisabled: PropTypes.bool,
  isEditIcon: PropTypes.bool,
  editIconClick: PropTypes.func,
};
