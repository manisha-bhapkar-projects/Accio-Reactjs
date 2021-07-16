import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Calendar from '../Calendar';
import { getDateISO } from '../../helper/calendar';
import editImg from '../../../../images/edit/edit.png';

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
    min: null,
    max: null,
    calendarOpen: false,
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
    const newDate = getDateISO(date);

    currentDate !== newDate &&
      this.setState({ date: newDate, calendarOpen: false }, () => {
        // onDateChange(newDate);

        typeof onDateChange === 'function' && onDateChange(newDate);
      });
  };

  get value() {
    return this.state.date || '';
  }

  get date() {
    const { date } = this.state;
    return date ? new Date(date) : null;
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
    const { value: date, min, max } = this.props;
    const minDate = getDateISO(min ? new Date(min) : null);
    const maxDate = getDateISO(max ? new Date(max) : null);
    const newDate = getDateISO(date ? new Date(date) : null);

    minDate && this.setState({ min: minDate });
    maxDate && this.setState({ max: maxDate });
    newDate && this.setState({ date: newDate });
  }

  componentDidUpdate(prevProps) {
    const { value: date, min, max } = this.props;
    const { value: prevDate, min: prevMin, max: prevMax } = prevProps;

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
    const {
      label,
      error,
      helperText,
      isEditIcon,
      handleEditClick,
    } = this.props;
    const { calendarOpen } = this.state;
    const [value, placeholder] = [this.value, ''].map(v =>
      v.replace(/-/g, '-'),
    );

    return (
      <div className={`custome-date-picker-component ${this.props.className}`}>
        {label ? (
          <label
            htmlFor="id"
            //className="input-label "
            className={!error ? `input-label` : `input-label  error `}
          >
            {label}
          </label>
        ) : (
          ''
        )}
        <DatePickerContainer>
          <DatePickerInput
            type="text"
            readOnly="readonly"
            className={!error ? 'date-input' : 'date-input error'}
            value={value ? moment(value).format('DD-MMM-Y') : value}
            onChange={this.handleChange}
            placeholder={placeholder}
          />
          {isEditIcon ? (
            <>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={null}
                className="datepicker-edit-icon"
                onClick={handleEditClick}
              >
                <img alt="edit" className="cursor" src={editImg} />
              </div>
            </>
          ) : null}
          {helperText && error ? (
            <small className={!error ? `helper-text` : `helper-text error`}>
              {helperText}
            </small>
          ) : (
            ''
          )}
          <DatePickerDropdown
            isOpen={calendarOpen}
            toggle={this.toggleCalendar}
            disabled={this.props.isDisable}
          >
            <DatePickerDropdownToggle color="transparent" />

            <DatePickerDropdownMenu>
              {calendarOpen && (
                <Calendar
                  date={this.date}
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
  value: '',
  isbeforeDateNotSelectable: false,
  beforeDateNotSelectable: new Date(),
  specialDate: [],
  publicHolidayDates: [],
  weekEnds: [0, 6],
  error: false,
  helperText: '',
  isDisable: false,
  isEditIcon: false,
};
DatePicker.propTypes = {
  min: PropTypes.string.isRequired,
  max: PropTypes.string.isRequired,
  date: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
  isbeforeDateNotSelectable: PropTypes.bool,
  beforeDateNotSelectable: PropTypes.string,
  specialDate: PropTypes.array,
  publicHolidayDates: PropTypes.array,
  weekEnds: PropTypes.array,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  isDisable: PropTypes.bool,
  isEditIcon: PropTypes.bool,
  handleEditClick: PropTypes.func,
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
