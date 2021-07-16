import React, { useState } from 'react';
import moment from 'moment';

// import TimePicker from 'rc-time-picker';
import { useTranslation } from 'react-i18next';

import 'rc-time-picker/assets/index.css';
import CardHeader from '../../../../components/CardHeader/CardHeader';
import './ScheduleKickOffMeeting.scss';
import TextFieldComponent from '../../../../components/TextFieldComponent/TextFieldComponent';
import Editor from '../../../../components/CKEditor/Editor';
import CustomDatePicker from '../../../../components/CustomDatePicker';
// import CustomRangeDatePicker from '../../../../components/CustomRangeDatePicker';

import constants from '../../../../utils/Locales/messages';

import {
  maxDate,
  minDate,
  timeFormat,
  specialDates,
  teamMembers,
  publicHolidayDates,
  weekEnd,
} from '../../../../utils/DemoData/scheduleKickOffData';
import ErrorAlert from '../../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import CustomTimePicker from '../../../../components/CustomTimePicker/CustomTimePicker';

function ScheduleKickOffMeeting() {
  const [startDate, setstartDate] = useState(moment().format('DD-MMMM-yyyy'));
  const [endDate, setendDate] = useState(moment().format('DD-MMMM-yyyy'));
  // const [startDateRange, setstartDateRange] = useState(
  //   moment('08-JUL-2020').format('DD-MMMM-yyyy'),
  // );
  // const [endDateRange, setendDateRange] = useState(
  //   moment('16-JUL-2020').format('DD-MMMM-yyyy'),
  // );
  const [isErrorPopup, setIsErrorPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [startTime, setstartTime] = useState({
    hour: 0,
    minute: 0,
    a: 'AM',
  });
  const [endTime, setendTime] = useState({
    hour: 0,
    minute: 0,
    a: 'AM',
  });
  const [attendees, setAttendees] = useState(teamMembers.join(' '));
  const [isAttendeesError, setAttendeesError] = useState(false);

  const [location, setLocation] = useState('');
  const [isLocationError, setLocationError] = useState(false);

  const [message, setMessage] = useState('');
  const [isMessageError, setMessageError] = useState(false);

  const onAttendesTextChangelistner = e => {
    if (e.target.value === '') {
      setAttendeesError(!isAttendeesError);
    } else {
      setAttendeesError(false);
    }

    // back Space
    if (
      e.target.value.charAt(e.target.value.length - 1) === ' ' &&
      e.target.value.trim().charAt(e.target.value.trim().length - 1) === ';'
    ) {
      return null;
    }

    setAttendees(`${e.target.value.split('; ').join(' ')}`);

    return null;
  };

  const onLocationTextChangelistner = e => {
    if (e.target.value === '') {
      setLocationError(true);
    } else {
      setLocationError(false);
    }
    setLocation(e.target.value);
  };

  const onMessageTextChangeListner = _message => {
    if (_message === '') {
      setMessageError(true);
    } else {
      setMessageError(false);
    }
    setMessage(_message);
  };

  const onSendClickListner = () => {
    const sTime = moment(
      `${startDate} ${startTime.hour}:${startTime.minute}${startTime.a}`,
      'DD-MMMM-yyyy h:mma',
    );
    const eTime = moment(
      `${endDate} ${endTime.hour}:${endTime.minute}${endTime.a}`,
      'DD-MMMM-yyyy h:mma',
    );
    if (
      attendees === '' ||
      !sTime.isBefore(eTime) ||
      location === '' ||
      message === ''
    ) {
      // Check Attendees List Empty or not (Show Error Label)
      if (attendees === '') {
        setAttendeesError(true);
      } else {
        setAttendeesError(false);
      }

      // Check Start Time and End time Valid or not (Show Error on Popup)

      if (!sTime.isBefore(eTime)) {
        // Show Popup that the End time is Before Start time
        setIsErrorPopup(true);
      }

      // Check Location Empty or not (Show Error Label)
      if (location === '') {
        setLocationError(true);
      } else {
        setLocationError(false);
      }

      // Check Location Regex Pattern (Show Error Label)

      // Check Message Empty or not (Show Error Label)
      if (message === '') {
        setMessageError(true);
      } else {
        setMessageError(false);
      }

      // Check Message Regex Pattern (Show Error Label)
    } else {
      setIsSuccess(true);
    }
  };
  const { t } = useTranslation();

  return (
    <div className="Schedule-KickOff-Meeting">
      <div className="card-container">
        <CardHeader title="Schedule Kick-Off Meeting" />
        <div className="mail-content mt-3">
          <div className="attendess my-2">
            <TextFieldComponent
              id="attendess"
              label={`${t('KICK_OFF.SCHEDULE_KICK_OFF_MEETING.ATTENDESS')}`}
              value={attendees.split(' ').join('; ')}
              labelClassName="label-text-bolder mt-3"
              inputClassName="input-attendess"
              type="text"
              onChange={onAttendesTextChangelistner}
              error={isAttendeesError}
              helperText={constants.GLOBAL.MANDATORY_FIELD}
            />
          </div>
          <div className="start-date">
            <CustomDatePicker
              label={`${t('KICK_OFF.SCHEDULE_KICK_OFF_MEETING.DATE')}`}
              value={startDate}
              min={maxDate}
              max={minDate}
              // specialDate={specialDates}
              isDisable={false}
              onDateChange={_date => {
                setstartDate(_date);
                setendDate(_date);
              }}
            />
            <CustomTimePicker
              showSecond={false}
              // label="start Time"
              label={`${t('KICK_OFF.SCHEDULE_KICK_OFF_MEETING.START_TIME')}`}
              defaultValue={moment()
                .hour(startTime.hour)
                .minute(startTime.minute)}
              className="align-self-end mx-4"
              onChange={time => {
                setstartTime({
                  hour: time.format('hh'),
                  minute: time.format('mm'),
                  a: time.format('a'),
                });
              }}
              format={timeFormat}
              use12Hours
              inputReadOnly
            />
            <CustomTimePicker
              // label="end Time"
              label={`${t('KICK_OFF.SCHEDULE_KICK_OFF_MEETING.END_TIME')}`}
              className="align-self-end"
              showSecond={false}
              defaultValue={moment()
                .hour(endTime.hour)
                .minute(endTime.minute)}
              onChange={time => {
                setendTime({
                  hour: time.format('hh'),
                  minute: time.format('mm'),
                  a: time.format('a'),
                });
              }}
              format={timeFormat}
              use12Hours
              inputReadOnly
            />
          </div>

          <div className="end-date">
            <CustomDatePicker
              // label="end Time"
              label={`${t('KICK_OFF.SCHEDULE_KICK_OFF_MEETING.END_TIME')}`}
              value={endDate}
              min={maxDate}
              max={minDate}
              specialDate={specialDates}
              publicHolidayDates={publicHolidayDates}
              weekEnds={weekEnd}
              isbeforeDateNotSelectable
              beforeDateNotSelectable={startDate}
              onDateChange={_date => setendDate(_date)}
            />
          </div>
          {/* <CustomRangeDatePicker
            label="Date Range Picker"
            startDate={startDateRange}
            endDate={endDateRange}
            className="align-self-end mt-4"
            min={maxDate}
            max={minDate}
            onDateChange={(_date, _dateType) => {
              // console.log(_date, _dateType);
              _dateType === 'EndDate'
                ? setendDateRange(_date)
                : setstartDateRange(_date);
            }}
          /> */}
          <div className="location-section mt-3">
            <TextFieldComponent
              id="location"
              type="text"
              isDisable={false}
              name="location"
              // label="location"
              label={`${t('KICK_OFF.SCHEDULE_KICK_OFF_MEETING.LOCATION')}`}
              labelClassName="label-text-bolder mt-3"
              className="form-field"
              inputClassName="location-input"
              value={location}
              onChange={onLocationTextChangelistner}
              error={isLocationError}
              helperText={constants.GLOBAL.MANDATORY_FIELD}
            />
          </div>
          <div className="message-section mt-3">
            <Editor
              content={message}
              setContent={onMessageTextChangeListner}
              inputContainerClass=""
              labelClassName="label-text-bolder mt-3"
              // label="Message"
              label={`${t('KICK_OFF.SCHEDULE_KICK_OFF_MEETING.MESSAGE')}`}
              isError={isMessageError}
              helperText={constants.GLOBAL.MANDATORY_FIELD}
              helperTextClassName=""
              name=""
              lengthOfContent={500}
              displayLength={false}
            />
          </div>
        </div>
      </div>

      <div className="button-container">
        <button
          type="button"
          onClick={onSendClickListner}
          className="btn-submit"
        >
          Send
        </button>
      </div>
      <ErrorAlert
        alertMessage="End time is Before Start time"
        primaryButtonText="OK"
        open={isErrorPopup}
        setClose={() => setIsErrorPopup(!isErrorPopup)}
        primaryButtonOnClick={() => setIsErrorPopup(!isErrorPopup)}
      />
      <SuccessAlert
        alertMessage="Success"
        primaryButtonText="OK"
        open={isSuccess}
        setClose={() => setIsSuccess(false)}
        primaryButtonOnClick={() => setIsSuccess(false)}
      />
    </div>
  );
}

export default ScheduleKickOffMeeting;
