import { createSelector } from 'reselect';

export const getPublicHolidayDates = state =>
  state.datePicker.publicHolidayDates;
export const getSpecialDates = state => state.datePicker.specialDates;
export const getWeekEnd = state => state.datePicker.weekEnd;
export const getSpecialEventDates = state => state.datePicker.specialEventDates;
export const getIsApiCalling = state => state.datePicker.isApiCalling;
