import React, { useEffect } from 'react';
import CustomDatePicker from '../Datepicker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getHodidayAPIAction } from '../../../../actions/datePickerAction';
import {
  getPublicHolidayDates,
  getSpecialDates,
  getWeekEnd,
  getSpecialEventDates,
} from '../selector';

function DatePickerWraper({
  onDateChange,
  isbeforeDateNotSelectable,
  beforeDateNotSelectable,
  publicHolidayDates,
  specialDates,
  weekEnd,
  specialEventDates,
  isApiCalling,
  getHodidayApi,
  isDisable,
  ...rest
}) {
  useEffect(() => {
    getHodidayApi();
  }, []);

  return (
    <CustomDatePicker
      specialDate={specialDates}
      publicHolidayDates={publicHolidayDates}
      weekEnds={weekEnd}
      isbeforeDateNotSelectable={isbeforeDateNotSelectable}
      beforeDateNotSelectable={beforeDateNotSelectable}
      onDateChange={onDateChange}
      isDisable={isDisable}
      {...rest}
    />
  );
}

const mapStateToProps = state => ({
  publicHolidayDates: getPublicHolidayDates(state),
  specialDates: getSpecialDates(state),
  weekEnd: getWeekEnd(state),
  specialEventDates: getSpecialEventDates(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getHodidayApi: getHodidayAPIAction,
    },
    dispatch,
  );
export default connect(mapStateToProps, mapDispatchToProps)(DatePickerWraper);
