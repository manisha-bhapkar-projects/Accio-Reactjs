import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Calendar from '../Calendar';
import { getDateISO } from '../../helper/calendar';
import {
  DatePickerContainer,
  // DatePickerFormGroup,
  // DatePickerLabel,
  DatePickerInput,
  DatePickerDropdown,
  DatePickerDropdownToggle,
  DatePickerDropdownMenu,
} from './styles';
import './Datepicker.scss';

class DatePicker extends React.Component {
  state = {
    date: null,
    endDate: this.props.endDate,
    min: null,
    max: null,
    calendarOpen: false,
    dateStatus: false,
  };

  toggleCalendar = () => {
    // alert(this.state.calendarOpen)

    // eslint-disable-next-line react/destructuring-assignment
    this.setState({ calendarOpen: !this.state.calendarOpen });
  };

  handleChange = evt => evt.preventDefault();

  handleDateChange = date => {
    const { onDateChange } = this.props;
    const { date: currentDate } = this.state;
    // const { endDate: currentDate } = this.state;

    const newDate = getDateISO(date);
    // console.log(this.state);
    if (this.state.dateStatus) {
      currentDate !== newDate &&
        this.setState({ endDate: newDate, dateStatus: false }, () => {
          // onDateChange(newDate);
          let exChange = false;
          if (
            new Date(this.state.date).getTime() >
            new Date(this.state.endDate).getTime()
          ) {
            exChange = true;
            this.setState({
              date: this.state.endDate,
              endDate: tempDate,
            });
          }

          typeof onDateChange === 'function' &&
            onDateChange(newDate, exChange ? 'StartDate' : 'EndDate');
        });
    } else {
      currentDate !== newDate &&
        this.setState({ date: newDate, dateStatus: true }, () => {
          // onDateChange(newDate);
          let exChange = false;

          if (
            new Date(this.state.date).getTime() >
            new Date(this.state.endDate).getTime()
          ) {
            exChange = true;

            this.setState({
              date: this.state.endDate,
              endDate: tempDate,
            });
          }
          typeof onDateChange === 'function' &&
            onDateChange(newDate, exChange ? 'EndDate' : 'StartDate');
        });
    }
    const tempDate = this.state.date;
  };

  get startDate() {
    return this.state.date || '';
  }
  get endDate() {
    return this.state.endDate || '';
  }
  get date() {
    const { date } = this.state;
    return date ? new Date(date) : null;
  }
  get endDates() {
    const { endDate } = this.state;
    return endDate ? new Date(endDate) : null;
  }
  get mindate() {
    const { min } = this.state;
    return min ? new Date(min) : null;
  }

  get maxdate() {
    const { max } = this.state;
    return max ? new Date(max) : null;
  }

  get specialDate() {
    //  moment(new Date(ds.substr(0, 16))
    return this.props.specialDate && this.props.specialDate.length
      ? this.props.specialDate.map(day => new Date(day).toLocaleDateString())
      : [];
  }

  get publicHolidayDates() {
    //  moment(new Date(ds.substr(0, 16))
    return this.props.publicHolidayDates && this.props.publicHolidayDates.length
      ? this.props.publicHolidayDates.map(day =>
          new Date(day).toLocaleDateString(),
        )
      : [];
  }

  get isbeforeDateNotSelectable() {
    return this.props.isbeforeDateNotSelectable
      ? this.props.isbeforeDateNotSelectable
      : false;
  }

  get beforeDateNotSelectable() {
    return this.props.beforeDateNotSelectable
      ? new Date(this.props.beforeDateNotSelectable)
      : new Date();
  }

  componentDidMount() {
    const { startDate: date, min, max } = this.props;
    const minDate = getDateISO(min ? new Date(min) : null);
    const maxDate = getDateISO(max ? new Date(max) : null);
    const newDate = getDateISO(date ? new Date(date) : null);

    minDate && this.setState({ min: minDate });
    maxDate && this.setState({ max: maxDate });
    newDate && this.setState({ date: newDate });
  }

  componentDidUpdate(prevProps) {
    const { startDate: date, min, max } = this.props;
    const { startDate: prevDate, min: prevMin, max: prevMax } = prevProps;

    const dateISO = getDateISO(new Date(date));
    const prevDateISO = getDateISO(new Date(prevDate));

    const minISO = getDateISO(new Date(min));
    const prevMinISO = getDateISO(new Date(prevMin));

    const maxISO = getDateISO(new Date(max));
    const prevMaxISO = getDateISO(new Date(prevMax));

    // eslint-disable-next-line react/no-did-update-set-state
    minISO !== prevMinISO && this.setState({ min: minISO });
    // eslint-disable-next-line react/no-did-update-set-state
    maxISO !== prevMaxISO && this.setState({ max: maxISO });
    // eslint-disable-next-line react/no-did-update-set-state
    dateISO !== prevDateISO && this.setState({ date: dateISO });
  }

  render() {
    const { label, className } = this.props;
    const { calendarOpen } = this.state;
    const [startDate, placeholder, endDate] = [
      this.startDate,
      'To',
      this.endDate,
    ].map(v => v.replace(/-/g, '-'));

    return (
      <div className={`custome-date-picker-component  ${className}`}>
        {label ? (
          <label htmlFor="id" className="input-label ">
            {label}
          </label>
        ) : (
          ''
        )}
        <DatePickerContainer>
          <DatePickerInput
            type="text"
            readOnly="readonly"
            className="date-input"
            value={
              startDate !== 'Invalid date' && endDate !== 'Invalid date'
                ? moment(startDate).format('DD-MMM-Y') +
                  ' To ' +
                  moment(endDate).format('DD-MMM-Y')
                : ''
            }
            // endDate={endDate ? moment(endDate).format('DD-MMM-Y') : endDate}
            onChange={this.handleChange}
            // placeholder={placeholder}
          />

          {/* {helperText && error ? (
        <small
          className={
            !error
              ? `${helperTextClassName} helper-text`
              : `${helperTextClassName} helper-text error`
          }
        >
          {helperText}
        </small>
      ) : (
        ''
      )} */}
          <DatePickerDropdown
            isOpen={calendarOpen}
            toggle={this.toggleCalendar}
          >
            <DatePickerDropdownToggle color="transparent" />

            <DatePickerDropdownMenu>
              {calendarOpen && (
                <Calendar
                  date={this.date}
                  endDate={this.endDates}
                  min={this.mindate}
                  max={this.maxdate}
                  specialDate={this.specialDate}
                  publicHolidayDates={this.publicHolidayDates}
                  weekEnds={this.props.weekEnds}
                  onDateChanged={this.handleDateChange}
                  isbeforeDateNotSelectable={this.isbeforeDateNotSelectable}
                  beforeDateNotSelectable={this.beforeDateNotSelectable}
                />
              )}
            </DatePickerDropdownMenu>
          </DatePickerDropdown>
        </DatePickerContainer>
      </div>
    );
  }
}
DatePicker.defaultProps = {
  label: '',
  className: '',
  startDate: '',
  endDate: '',
  isbeforeDateNotSelectable: false,
  beforeDateNotSelectable: new Date(),
  specialDate: [],
  publicHolidayDates: [],
  weekEnds: [0, 6],
};
DatePicker.propTypes = {
  min: PropTypes.string.isRequired,
  max: PropTypes.string.isRequired,
  className: PropTypes.string,
  date: PropTypes.string,
  label: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
  isbeforeDateNotSelectable: PropTypes.bool,
  beforeDateNotSelectable: PropTypes.string,
  specialDate: PropTypes.array,
  publicHolidayDates: PropTypes.array,
  weekEnds: PropTypes.array,
};

export default DatePicker;

// eslint-disable-next-line no-lone-blocks
{
  /* <DatePickerContainer>
  <DatePickerFormGroup>
    <DatePickerLabel>{label || "Enter Date"}</DatePickerLabel>
    <DatePickerInput
      type="text"
      readOnly="readonly"
      value={value}
      onChange={this.handleChange}
      placeholder={placeholder}
    />
  </DatePickerFormGroup>

  <DatePickerDropdown isOpen={calendarOpen} toggle={this.toggleCalendar}>
    <DatePickerDropdownToggle color="transparent" />

    <DatePickerDropdownMenu>
      {calendarOpen && (
        <Calendar
          date={this.date}
          min={this.mindate}
          max={this.maxdate}
          onDateChanged={this.handleDateChange}
        />
      )}
    </DatePickerDropdownMenu>
  </DatePickerDropdown>
</DatePickerContainer> */
}
