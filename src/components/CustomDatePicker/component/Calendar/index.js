import React from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
// import Arrow from "../../../../images/arrow/";
// import ArrowBlue from "../../../../images/arrow/Arrow-down-blue.png";
import _ from 'lodash';
import {
  ArrowLeft,
  ArrowRight,
  CalendarContainer,
  CalendarHeader,
  CalendarGrid,
  MonthGrid,
  CalendarDay,
  MonthUi,
  MonthSelectUi,
  CalendarDate,
  CalendarDateDisble,
  CalendarMonth,
  HighlightedCalendarDate,
  WeekEndDate,
  SpecialDaysUi,
  PublicHolidayUi,
  TodayCalendarDate,
} from './styles';
import calendar, {
  isDate,
  dateDiff,
  isBeforeDay,
  isAfterDay,
  isSameDay,
  isSameMonth,
  getDateISO,
  getDateArray,
  getNextMonth,
  getPreviousMonth,
  getMonthDays,
  WEEK_DAYS,
  CALENDAR_MONTHS,
} from '../../helper/calendar';

class Calendar extends React.Component {
  /**
   *  view = 1 => Calender View
   *  view = 2 => Month View
   *  view = 3 => Year View
   */
  state = { ...this.stateFromProp(), today: new Date(), view: 1 };

  // eslint-disable-next-line react/sort-comp
  changeHandler = date => () => {
    const { onDateChanged } = this.props;
    typeof onDateChanged === 'function' && onDateChanged(date);
  };

  stateFromDate({ date, min, max } = {}) {
    const {
      mindate: stateMinDate,
      maxdate: stateMaxDate,
      current: stateCurrent,
    } = this.state || {};
    const minDate = min || stateMinDate;
    const maxDate = max || stateMaxDate;
    const currentDate = date || stateCurrent;

    const mindate = isAfterDay(minDate, maxDate) ? null : minDate;
    const maxdate = isBeforeDay(maxDate, minDate) ? null : maxDate;
    const current = this.calendarWithinRange(currentDate, { mindate, maxdate })
      ? currentDate
      : null;

    const calendarDate = current || new Date();

    const [year, month] = getDateArray(
      this.calendarWithinRange(calendarDate, { mindate, maxdate })
        ? calendarDate
        : maxdate,
    );

    return { current, month, year, mindate, maxdate };
  }

  stateFromProp() {
    return this.stateFromDate(this.props);
  }

  calendarWithinRange(date, { maxdate, mindate } = this.state) {
    if (!isDate(date)) return false;
    const min = new Date(new Date(+mindate).setDate(1)).setHours(0, 0, 0, 0);
    const max = new Date(
      new Date(+maxdate).setDate(getMonthDays(maxdate)),
    ).setHours(23, 59, 59, 999);

    return (date >= min || !mindate) && (date <= max || !maxdate);
  }

  getCalendarDates = () => {
    const { current, month, year } = this.state;
    const [currentYear, currentMonth] = current ? getDateArray(current) : [];
    return calendar(new Date([year || currentYear, month || currentMonth]));
  };

  gotoDate = (date, weekEnd) => evt => {
    if (weekEnd) {
      return null;
    }
    evt && evt.preventDefault();
    const { current, maxdate, mindate } = this.state;
    const isCurrent = current && isSameDay(date, current);
    const outOfRange = isBeforeDay(date, mindate) || isAfterDay(date, maxdate);

    !(isCurrent || outOfRange) &&
      this.setState(this.stateFromDate({ date }), this.changeHandler(date));
  };

  gotoPreviousMonth = () => {
    const { month, year } = this.state;
    const previousMonth = getPreviousMonth(new Date([year, month]));
    const previous = new Date([previousMonth.year, previousMonth.month]);
    this.calendarWithinRange(previous) && this.setState(previousMonth);
  };

  gotoNextMonth = () => {
    const { month, year } = this.state;
    const nextMonth = getNextMonth(new Date([year, month]));
    const next = new Date([nextMonth.year, nextMonth.month]);

    this.calendarWithinRange(next) && this.setState(nextMonth);
  };

  gotoPreviousYear = () => {
    const { month, year } = this.state;
    const previous = new Date([year - 1, month]);
    this.calendarWithinRange(previous) && this.setState({ year: year - 1 });
  };

  gotoNextYear = () => {
    const { month, year } = this.state;
    const next = new Date([year + 1, month]);
    this.calendarWithinRange(next) && this.setState({ year: year + 1 });
  };

  handlePressure = evt => (fn, fnShift) => {
    if (typeof fn === 'function' && typeof fnShift === 'function') {
      this.pressureShift = evt.shiftKey;
      this.pressureShift ? fnShift() : fn();

      this.pressureTimeout = setTimeout(() => {
        this.pressureTimer = setInterval(
          () => (this.pressureShift ? fnShift() : fn()),
          100,
        );
      }, 500);
      document.addEventListener('keyup', this.handlePressureKeyup);
      document.addEventListener('keydown', this.handlePressureKeydown);
    }
  };

  handleMonthViewPressure = () => fn => {
    if (typeof fn === 'function') {
      fn();
      // this.pressureShift = evt.shiftKey;
      // this.pressureShift ? fnShift() : fn();

      // this.pressureTimeout = setTimeout(() => {
      //   this.pressureTimer = setInterval(
      //     () => (this.pressureShift ? fnShift() : fn()),
      //     100
      //   );
      // }, 500);

      document.addEventListener('keyup', this.handlePressureKeyup);
      document.addEventListener('keydown', this.handlePressureKeydown);
    }
  };

  handlePressureKeyup = evt => {
    evt.preventDefault();
    !evt.shiftKey && (this.pressureShift = !evt.shiftKey && false);
  };

  handlePressureKeydown = evt => {
    evt.preventDefault();
    evt.shiftKey && (this.pressureShift = true);
  };

  clearPressureTimer = () => {
    this.pressureTimer && clearInterval(this.pressureTimer);
    this.pressureTimeout && clearTimeout(this.pressureTimeout);

    this.pressureShift = false;

    document.removeEventListener('keyup', this.handlePressureKeyup);
    document.removeEventListener('keydown', this.handlePressureKeydown);
  };

  clearDayTimeout = () => {
    this.dayTimeout && clearTimeout(this.dayTimeout);
  };

  handlePrevious = evt => {
    return (
      evt &&
      (evt.preventDefault(),
      this.handlePressure(evt)(this.gotoPreviousMonth, this.gotoPreviousYear))
    );
  };

  handleNext = evt => {
    return (
      evt &&
      (evt.preventDefault(),
      this.handlePressure(evt)(this.gotoNextMonth, this.gotoNextYear))
    );
  };

  handleMonthViewPrevious = evt => {
    evt && evt.preventDefault();
    this.gotoPreviousYear();
  };

  handleMonthViewNext = evt => {
    evt && evt.preventDefault();
    this.gotoNextYear();
  };

  // eslint-disable-next-line react/sort-comp
  renderMonthAndYear = () => {
    const { month, year } = this.state;
    const monthname = Object.keys(CALENDAR_MONTHS)[
      Math.max(0, Math.min(month - 1, 11))
    ];
    const props = { onMouseUp: this.clearPressureTimer };

    return (
      <CalendarHeader>
        <ArrowLeft
          title="Previous"
          onMouseDown={this.handlePrevious}
          {...props}
        />

        <CalendarMonth onClick={() => this.setState({ view: 2 })}>
          {monthname} {year}
        </CalendarMonth>
        <ArrowRight title="Next" onMouseDown={this.handleNext} {...props} />
      </CalendarHeader>
    );
  };

  renderMonthView = () => {
    // const { month, year } = this.state;
    const { year } = this.state;

    // const monthname = Object.keys(CALENDAR_MONTHS)[
    //   Math.max(0, Math.min(month - 1, 11))
    // ];
    const props = { onMouseUp: this.clearPressureTimer };

    return (
      <CalendarHeader>
        <ArrowLeft
          title="Previous"
          onMouseDown={this.handleMonthViewPrevious}
          {...props}
        />
        <CalendarMonth>{year}</CalendarMonth>
        <ArrowRight
          title="Next"
          onMouseDown={this.handleMonthViewNext}
          {...props}
        />
      </CalendarHeader>
    );
  };

  // Days Title sun to sat
  renderDayLabels = (day, index) => {
    const daylabel = WEEK_DAYS[day].toUpperCase();
    return (
      <CalendarDay key={daylabel} index={index}>
        {daylabel}
      </CalendarDay>
    );
  };

  renderMonthLabels = (month, index) => {
    // console.log(this.state.month);
    const monthlabel = CALENDAR_MONTHS[month].toUpperCase();
    return this.state.month - 1 === index ? (
      <MonthSelectUi
        key={monthlabel}
        index={index}
        onClick={() => {
          this.setState({
            view: 1,
            month: index + 1,
          });
        }}
      >
        {monthlabel}
        {/* {month} */}
      </MonthSelectUi>
    ) : (
      <MonthUi
        key={monthlabel}
        index={index}
        onClick={() => {
          this.setState({
            view: 1,
            month: index + 1,
          });
        }}
      >
        {monthlabel}
        {/* {month} */}
      </MonthUi>
    );
  };
  isInArray(array, value) {
    return _.includes(array, value, 0);
  }
  // date 1 to 30
  renderCalendarDate = (date, index) => {
    const { current, month, year, today, maxdate, mindate } = this.state;
    const thisDay = new Date(date);
    const monthFirstDay = new Date([year, month]);

    const isToday = !!today && isSameDay(thisDay, today);
    const isCurrent = !!current && isSameDay(thisDay, current);
    const inMonth = !!(month && year) && isSameMonth(thisDay, monthFirstDay);
    const inRange = !(
      isBeforeDay(thisDay, mindate) || isAfterDay(thisDay, maxdate)
    );
    const props = {
      index,
      inMonth,
      inRange,
      // onClick: this.gotoDate(thisDay),
      title: thisDay.toDateString(),
    };
    let isWeekend,
      dateDisbleUi = false;
    const specialDays = this.isInArray(
      this.props.specialDate,
      new Date(thisDay).toLocaleDateString(),
    );
    const publicHoliday = this.isInArray(
      this.props.publicHolidayDates,
      new Date(thisDay).toLocaleDateString(),
    );

    // if ( thisDay.getDay() === 6 || thisDay.getDay() === 0) {
    if (this.props.weekEnds.includes(thisDay.getDay())) {
      isWeekend = true;
    }
    if (this.props.isbeforeDateNotSelectable) {
      if (
        new Date(this.props.beforeDateNotSelectable).getTime() -
          24 * 60 * 60 * 1000 >
        thisDay.getTime()
      ) {
        dateDisbleUi = true;
      }
    }
    // console.log(
    //   new Date(this.props.beforeDateNotSelectable),
    //   thisDay,
    //   new Date(this.props.beforeDateNotSelectable).getTime() >
    //     thisDay.getTime(),
    // );

    const DateComponent = isToday
      ? TodayCalendarDate
      : isWeekend
      ? WeekEndDate
      : publicHoliday
      ? PublicHolidayUi
      : specialDays
      ? SpecialDaysUi
      : dateDisbleUi
      ? CalendarDateDisble
      : isCurrent
      ? HighlightedCalendarDate
      : CalendarDate;

    return (
      <>
        <DateComponent
          key={getDateISO(thisDay)}
          onClick={this.gotoDate(
            thisDay,
            isWeekend || dateDisbleUi || specialDays,
          )}
          // data-tip
          // data-for="notificationClickme"
          // data-event="hover"
          // data-offset="left"
          data-tip={
            isToday
              ? "Today's Date"
              : publicHoliday
              ? 'Public Holiday'
              : specialDays
              ? 'Special Day'
              : ''
          }
          data-place="right"
          // data-type="info"
          {...props}
        >
          {thisDay.getDate()}
        </DateComponent>
        <ReactTooltip />
      </>
    );
  };

  componentDidMount() {
    const tomorrow = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;

    this.dayTimeout = setTimeout(() => {
      this.setState({ today: new Date() }, this.clearDayTimeout);
    }, dateDiff(tomorrow));
  }

  componentDidUpdate(prevProps) {
    const { date, min, max } = this.props;
    const { date: prevDate, min: prevMin, max: prevMax } = prevProps;

    const dateMatch = date === prevDate || isSameDay(date, prevDate);
    const minMatch = min === prevMin || isSameDay(min, prevMin);
    const maxMatch = max === prevMax || isSameDay(max, prevMax);

    !(dateMatch && minMatch && maxMatch) &&
      this.setState(this.stateFromDate(date), this.changeHandler(date));
  }

  componentWillUnmount() {
    this.clearPressureTimer();
    this.clearDayTimeout();
  }

  render() {
    return (
      <CalendarContainer>
        {this.state.view === 1
          ? this.renderMonthAndYear()
          : this.renderMonthView()}
        {this.state.view === 1 ? (
          <CalendarGrid>
            <React.Fragment>
              <React.Fragment>
                {Object.keys(WEEK_DAYS).map(this.renderDayLabels)}
              </React.Fragment>
              <React.Fragment>
                {this.getCalendarDates().map(this.renderCalendarDate)}
              </React.Fragment>{' '}
            </React.Fragment>
          </CalendarGrid>
        ) : (
          <MonthGrid>
            <React.Fragment>
              <React.Fragment>
                {Object.keys(CALENDAR_MONTHS).map(this.renderMonthLabels)}
              </React.Fragment>
            </React.Fragment>
          </MonthGrid>
        )}
      </CalendarContainer>
    );
  }
}

Calendar.propTypes = {
  min: PropTypes.instanceOf(Date).isRequired,
  max: PropTypes.instanceOf(Date).isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  onDateChanged: PropTypes.func.isRequired,
  isbeforeDateNotSelectable: PropTypes.bool.isRequired,
  beforeDateNotSelectable: PropTypes.string.isRequired,
  weekEnds: PropTypes.array.isRequired,
  publicHolidayDates: PropTypes.array.isRequired,
  specialDate: PropTypes.array.isRequired,
};

export default Calendar;
