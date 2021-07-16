import React, { useEffect } from 'react';
import CustomRangeDatePicker from '../Datepicker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getHodidayAPIAction } from '../../../../actions/datePickerAction';
// import moment from 'moment';
import {
  getPublicHolidayDates,
  getSpecialDates,
  getWeekEnd,
  getSpecialEventDates,
  getIsApiCalling,
} from '../../../CustomDatePicker/component/selector';

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
  ...rest
}) {
  useEffect(() => {
    if (isApiCalling) {
      getHodidayApi();
    }
  });

  return (
    <CustomRangeDatePicker
      specialDate={specialDates}
      publicHolidayDates={publicHolidayDates}
      weekEnds={weekEnd}
      isbeforeDateNotSelectable={isbeforeDateNotSelectable}
      beforeDateNotSelectable={beforeDateNotSelectable}
      onDateChange={onDateChange}
      {...rest}
    />
  );
}

const mapStateToProps = state => ({
  publicHolidayDates: getPublicHolidayDates(state),
  specialDates: getSpecialDates(state),
  weekEnd: getWeekEnd(state),
  specialEventDates: getSpecialEventDates(state),
  isApiCalling: getIsApiCalling(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // callSpecialDatesApi: specialDatesAction,
      // callPublicHolidayDatesApi: publicHolidayDatesAction,
      // callWeekEndApi: weekEndAction,
      getHodidayApi: getHodidayAPIAction,
    },
    dispatch,
  );
export default connect(mapStateToProps, mapDispatchToProps)(DatePickerWraper);
