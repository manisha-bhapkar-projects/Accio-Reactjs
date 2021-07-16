import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next'; // multi langauge support
import PropTypes from 'prop-types';
import CardHeader from '../../../../components/CardHeader/CardHeader';
import LinksWizard from '../../../../components/LinksWizard/LinksWizard';
import InformationAlert from '../../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import ErrorAlert from '../../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import Step1 from './Step1/Step1';
import Step3 from './Step3/Step3';
import Step2 from './Step2/Step2';
import Step4 from './Step4/Step4';
import './KickOffMeetingAndSignOff.scss';

import { getErrorMessage, getTitleOfScreen } from '../../../../utils/utils';
import { validateEmail } from '../../../../utils/validation';

import {
  getMeetingAttendee,
  saveAttendee,
  saveNotesData,
  getMeetingDetails,
} from '../../../../actions/Business/kickOffMeetingAndSignOff';

const KickOffMeetingAndSignOff = props => {
  const { t } = useTranslation(); // for language translation

  // isSignOffScreen: when user clicks on sign button in step 4
  // const [isSignOffScreen, setIsSignOffScreen] = useState(false);

  // show screen title
  const [subPhaseName, setSubPhaseName] = useState('');

  // alert
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // isAddNoteRequest: note add request or update
  const [isAddNoteRequest, setIsAddNoteRequest] = useState(true);

  const [meetingId] = useState('92faedcc-9703-4607-b400-6844b91d93f0');
  const [caseId] = useState('10e89b98-b99f-4435-94a9-e4f6d03a2532');

  // error
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // success
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  // step 1
  const [countOfStep1DataUpdated, setcountOfStep1DataUpdated] = useState(0);

  /**
   *  Wizard configuration
   *  activeStep
   *  steps
   *  onChangeWizard
   */

  // activeStep : for wizard active step
  const [activeStep, setActiveStep] = useState(0);

  // clickableSteps
  const [clickableSteps, setClickableSteps] = useState(0);

  // steps : to handle steps data
  const [steps, setSteps] = useState([
    {
      id: 1,
      title: 'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.RECORD_ATTENDEES',
      status: 'current',
      isSaved: true,
      isError: false,
      step1Data: {
        attendeesList: [],
        attendeesListForReset: [],
      },
    },
    {
      id: 2,
      title: 'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.REVIEW_AND_UPDATE_DATES',
      status: '',
      isSaved: true,
      isError: false,
      step2Data: {},
    },
    {
      id: 3,
      title: 'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.ADD_NOTES_AND_COMMENTS',
      status: '',
      isSaved: false,
      isError: false,
      step3Data: {
        notes: '',
        notesForReset: '',
      },
    },
    {
      id: 4,
      title: 'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.PREVIEW_MOM_AND_SIGN_OFF',
      status: '',
      isSaved: false,
      step4Data: {},
    },
  ]);

  // handle title of screen
  const { location } = props;
  useEffect(() => {
    if (location.pathname) {
      getTitleOfScreen(location.pathname, title => setSubPhaseName(title));
    }
  }, [location]);

  // fetch details
  useEffect(() => {
    // fetch meeting details
    getMeetingDetails(meetingId)
      .then(_response => {
        if (_response.data.success) {
          setSuccessMessage(_response.data.message);
          setIsSuccessMessage(true);
          return true;
        }
        return false;
      })
      .then(() => {
        //  getMeetingAttendee
        return getMeetingAttendee(meetingId, caseId);
      })
      .then(_response => {
        if (_response.data.success) {
          setSuccessMessage(_response.data.message);
          setIsSuccessMessage(true);
        }
      })
      .catch(_error => {
        handleError(_error);
      });
  }, []);

  useEffect(() => {
    // step 1 data
    setTimeout(() => {
      const stepsData = [...steps];
      setIsAddNoteRequest(true);
      stepsData[0].step1Data.attendeesList = [
        {
          id: 1,
          name: 'Sirius Black',
          company: 'The Mall of UAE',
          email: 'sblack@mail.com',
          role: 'Tenant Coordinator Head ',
          isPresent: false,
          isTextBox: false,
        },
        {
          id: 2,
          name: 'Harry Potter',
          company: 'The Mall of UAE',
          email: 'hpotter@mail.com',
          role: 'Tenant Coordinator',
          isPresent: true,
          isTextBox: false,
        },
      ];
      stepsData[0].step1Data.attendeesListForReset = _.cloneDeep(
        stepsData[0].step1Data.attendeesList,
      );
      setClickableSteps(4);
      setSteps(stepsData);
    }, 1000);
  }, []);

  // onChangeWizard provide index of clicked step
  const onChangeWizard = indexOfStep => {
    const stepsData = [...steps];
    stepsData[indexOfStep].status = '';
    stepsData.forEach((e, phaseCount) => {
      if (phaseCount === indexOfStep) {
        stepsData[phaseCount].status = 'current';
        setActiveStep(phaseCount);
      } else {
        stepsData[phaseCount].status = '';
      }
    });
    setSteps(stepsData);
  };

  // step 1

  // changeStep1Data
  const changeAttendees = newData => {
    const stepsData = [...steps];
    stepsData[0].step1Data.attendeesList = newData;
    setSteps(stepsData);
  };

  //  validations
  // step 1 : isStep1Validate validates : check
  const isStep1Validate = () => {
    const stepsData = [...steps];
    // old data
    const oldData = stepsData[0].step1Data.attendeesList;
    // new data
    const newData = stepsData[0].step1Data.attendeesListForReset;

    if (!_.isEqual(newData, oldData)) return true; // prev and current data chaged so return true

    return false;
  };

  // step 3
  const changeNotes = note => {
    const stepsData = [...steps];
    stepsData[2].step3Data.notes = note;
    setSteps(stepsData);
  };

  // step 3 : isStep3Validate validates : check
  const isStep3Validate = () => {
    const stepsData = [...steps];
    // old data
    const oldData = stepsData[2].step3Data.notes;
    // new data
    const newData = stepsData[2].step3Data.notesForReset;

    if (!_.isEqual(newData, oldData)) return true; // prev and current data chaged so return true

    return false;
  };
  // global
  const toggleCancelMessagePopup = () => {
    setAlertMessage(t('GLOBAL.ERROR_MSG.ERR_CHANGES_LOST'));
    setIsAlertOpen(true);
  };

  // onCancelClickListner
  const onCancelClickListner = () => {
    if (activeStep === 0) {
      // step1
      if (isStep1Validate()) {
        toggleCancelMessagePopup();
      }
    } else if (activeStep === 2) {
      // step1
      if (isStep3Validate()) {
        toggleCancelMessagePopup();
      }
    }
  };

  // Information alert ok button click handler : handles reset step wise
  const handleInformationAlertOKButtonClick = () => {
    if (activeStep === 0) {
      // re-set attendees list
      const stepsData = [...steps];
      stepsData[0].step1Data.attendeesList = _.cloneDeep(
        stepsData[0].step1Data.attendeesListForReset,
      );
      setSteps(stepsData);
      setcountOfStep1DataUpdated(countOfStep1DataUpdated + 1);
      setIsAlertOpen(false);
    } else if (activeStep === 2) {
      // reset notes
      const stepsData = [...steps];
      stepsData[2].step3Data.notes = stepsData[2].step3Data.notesForReset;
      setSteps(stepsData);
      setIsAlertOpen(false);
    }
  };

  // handleError : handles error
  const handleError = error => {
    setErrorMessage(`${getErrorMessage(error)}`);
    setIsErrorMessage(true);
  };

  // goToNextStep : go to next step
  const goToNextStep = () => {
    const stepsData = [...steps];
    stepsData[activeStep].status = '';
    stepsData.forEach((e, stepCount) => {
      if (stepCount === activeStep + 1) {
        stepsData[stepCount].status = 'current';
        setActiveStep(activeStep + 1);
      } else {
        stepsData[stepCount].status = '';
      }
    });
    setSteps(stepsData);
  };

  /**
   * onSaveAndContinueClickListner
   * step wise
   * validate request
   * save functionality
   *
   */
  const onSaveAndContinueClickListner = () => {
    if (activeStep === 0) {
      // step 1: add attendee
      const stepsData = [...steps];
      const attendees = stepsData[0].step1Data.attendeesList;
      // if (attendees.length > 0) {
      // save attendees and go to next step
      // validations
      // const stepsData = [...steps];
      let isError = false; // for validate attendees
      attendees.forEach(attendee => {
        if (attendee.isTextBox) {
          // row with not all value: validate each input box of row
          if (
            attendee.name ||
            attendee.email ||
            attendee.company ||
            attendee.role
          ) {
            const indexOfAttendee = stepsData[0].step1Data.attendeesList.findIndex(
              a => a.id === attendee.id,
            );
            if (!attendee.name) {
              stepsData[0].step1Data.attendeesList[
                indexOfAttendee
              ].isNameError = true;
              stepsData[0].step1Data.attendeesList[
                indexOfAttendee
              ].nameErrorMessage = 'name required';
              isError = true;
            }
            if (!attendee.email) {
              stepsData[0].step1Data.attendeesList[
                indexOfAttendee
              ].isEmailError = true;
              stepsData[0].step1Data.attendeesList[
                indexOfAttendee
              ].emailErrorMessage = 'email required';
              isError = true;
            }
            if (!validateEmail(attendee.email)) {
              stepsData[0].step1Data.attendeesList[
                indexOfAttendee
              ].isEmailError = true;
              stepsData[0].step1Data.attendeesList[
                indexOfAttendee
              ].emailErrorMessage = 'Invalid Email';
              isError = true;
            }
            if (!attendee.company) {
              stepsData[0].step1Data.attendeesList[
                indexOfAttendee
              ].isCompanyError = true;
              stepsData[0].step1Data.attendeesList[
                indexOfAttendee
              ].companyErrorMessage = 'company required';
              isError = true;
            }
            if (!attendee.role) {
              stepsData[0].step1Data.attendeesList[
                indexOfAttendee
              ].isRoleError = true;
              stepsData[0].step1Data.attendeesList[
                indexOfAttendee
              ].roleErrorMessage = 'role required';
              isError = true;
            }
          }
        }
      });

      // if name,email,company and role all entered then change its errors to normal : remove this if not required
      attendees.forEach(attendee => {
        if (attendee.isTextBox) {
          if (
            !attendee.name &&
            !attendee.email &&
            !attendee.company &&
            !attendee.role
          ) {
            const indexOfAttendee = stepsData[0].step1Data.attendeesList.findIndex(
              a => a.id === attendee.id,
            );
            stepsData[0].step1Data.attendeesList[
              indexOfAttendee
            ].isNameError = false;
            stepsData[0].step1Data.attendeesList[
              indexOfAttendee
            ].nameErrorMessage = '';
            stepsData[0].step1Data.attendeesList[
              indexOfAttendee
            ].isEmailError = false;
            stepsData[0].step1Data.attendeesList[
              indexOfAttendee
            ].emailErrorMessage = '';
            stepsData[0].step1Data.attendeesList[
              indexOfAttendee
            ].isCompanyError = false;
            stepsData[0].step1Data.attendeesList[
              indexOfAttendee
            ].companyErrorMessage = '';
            stepsData[0].step1Data.attendeesList[
              indexOfAttendee
            ].isRoleError = false;
            stepsData[0].step1Data.attendeesList[
              indexOfAttendee
            ].roleErrorMessage = '';
          }
        }
      });
      // if there is any error then show messages and don't allow to call save api
      if (isError) {
        setSteps(stepsData);
        return;
      }
      // remove empty row from entered attendees : Here we are checking that if user not inserted anything in row then we are removing that row here
      //
      const allAttendeesWithRequiredData = [];
      attendees.forEach(attendee => {
        // new added attendee
        // if (attendee.isTextBox) {
        // row with all value
        if (
          attendee.name &&
          attendee.email &&
          attendee.company &&
          attendee.role
        ) {
          allAttendeesWithRequiredData.push({
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            roleName: attendee.role,
            organization: attendee.company,
            isInvited: true,
            isAdded: attendee.isTextBox,
            hasAttended: attendee.isPresent,
          });
        }
        // }
      });
      // "name":"name 01",
      // "email":"email@email.com",
      // "roleName": "Tenant Coordinator Head",
      // "organization": "organization 1",
      // "isInvited": true,
      // "isAdded": false,
      // "hasAttended": true
      // console.log('allAttendeesWithRequiredData', allAttendeesWithRequiredData);
      // isAddNoteRequest : state is handle at loading details of meeting

      // if (allAttendeesWithRequiredData.length === 0) {
      //   goToNextStep();
      //   return;
      // }

      const requestData = {
        caseMeetingScheduleRefId: meetingId,
        attendee: allAttendeesWithRequiredData,
      };

      //  {
      // 	"name":"name 01",
      // 	"email":"email@email.com",
      // 	"roleName": "Tenant Coordinator Head",
      // 	"organization": "organization 1",
      // 	"isInvited": true,
      // 	"isAdded": false,
      // 	"hasAttended": true
      // }

      saveAttendee(requestData)
        .then(_response => {
          if (_response.data.success) {
            // now we can set isTextBox true to false in attenddes who is added using addmore
            allAttendeesWithRequiredData.forEach(attendee => {
              attendees.forEach((oldAttendee, index) => {
                if (oldAttendee.id === attendee.id && attendee.isAdded) {
                  stepsData[0].step1Data.attendeesList[index].isTextBox = false;
                }
              });
            });
            stepsData[0].step1Data.attendeesListForReset = _.cloneDeep(
              stepsData[0].step1Data.attendeesList,
            );
            setSteps(stepsData);
            // if(isAddRequest){ // need to add validation here for add request here
            clickableSteps(2);
            // }
            setSuccessMessage(_response.data.message);
            setIsSuccessMessage(true);
          }
        })
        .catch(_error => {
          handleError(_error);
        });
      // } else {
      //   // go to next step if notes not inserted
      //   goToNextStep();
      // }
    } else if (activeStep === 1) {
      // step 2: update milestone dates
      goToNextStep();
    } else if (activeStep === 2) {
      // step 3: add / update notes and comments
      const stepsData = [...steps];
      const notesData = stepsData[2].step3Data.notes;
      if (notesData) {
        // save notes and go to next step
        // isAddNoteRequest : state is handle at loading details of meeting
        const requestData = {
          caseMeetingScheduleRefId: meetingId,
          meetingNotes: notesData,
        };
        saveNotesData(requestData, isAddNoteRequest)
          .then(_response => {
            if (_response.data.success) {
              setSuccessMessage(_response.data.message);
              setIsSuccessMessage(true);
            }
          })
          .catch(_error => {
            handleError(_error);
          });
      } else {
        // go to next step if notes not inserted
        goToNextStep();
      }
    }
  };

  const handleSuccessOkClick = () => {
    setIsSuccessMessage(false);
    goToNextStep();
    // if (activeStep === 2) {
    //   // step 3: add / update notes and comments
    //   setIsSuccessMessage(false);
    //   goToNextStep();
    // }
  };

  return (
    <div className="kick-off-meeting-and-sign-off">
      <div className="card-container">
        {/* Card Header */}
        <CardHeader title={subPhaseName} />
        <LinksWizard
          className="kick-off-meeting-and-sign-off-wizard"
          formSteps={steps}
          onSelectStep={onChangeWizard}
          clickableSteps={clickableSteps}
        />
        {/* Steps */}
        {steps.map(item => {
          if (item.id === 1 && item.status === 'current') {
            return (
              <div key={item.id} className="step-container">
                {steps[0].step1Data.attendeesList.length > 0 && (
                  <Step1
                    attendeesList={steps[0].step1Data.attendeesList}
                    changeAttendees={changeAttendees}
                    countOfStep1DataUpdated={countOfStep1DataUpdated}
                    setcountOfStep1DataUpdated={setcountOfStep1DataUpdated}
                  />
                )}
              </div>
            );
          }
          if (item.id === 2 && item.status === 'current') {
            return (
              <div key={item.id} className="step-container">
                <Step2 />
              </div>
            );
          }
          if (item.id === 3 && item.status === 'current') {
            return (
              <div key={item.id} className="step-container">
                <Step3
                  notes={steps[2].step3Data.notes}
                  changeNotes={changeNotes}
                />
              </div>
            );
          }
          if (item.id === 4 && item.status === 'current') {
            return (
              <div key={item.id} className="step-container">
                <Step4 />
              </div>
            );
          }
          return null;
        })}
      </div>
      {/* Buttons */}
      <div className="button-container">
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancelClickListner}
        >
          {t('GLOBAL.BUTTON_CANCEL')}
        </button>
        <button
          type="button"
          className="btn-save-close"
          // onClick={onSaveAndCloseClickListner}
        >
          {t('GLOBAL.BUTTON_SAVE_AND_CLOSE')}
        </button>
        {activeStep === 3 ? (
          <button
            type="button"
            // onClick={onSaveAndContinueClickListner}
            className="btn-sign"
          >
            {t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.SIGN')}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSaveAndContinueClickListner}
            className="btn-save-submit"
          >
            {t('GLOBAL.BUTTON_SAVE_AND_CONTINUE')}
          </button>
        )}
      </div>
      {/* alert box : populate , cancel */}
      <InformationAlert
        alertMessage={alertMessage}
        primaryButtonText={t('GLOBAL.YES')}
        secondaryButtonText={t('GLOBAL.NO')}
        open={isAlertOpen}
        setClose={() => setIsAlertOpen(!isAlertOpen)}
        primaryButtonOnClick={() => handleInformationAlertOKButtonClick()}
      />
      {/* error message */}
      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText={t('GLOBAL.OK')}
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />
      {/* success message */}
      <SuccessAlert
        alertMessage={successMessage}
        primaryButtonText={t('GLOBAL.OK')}
        open={isSuccessMessage}
        setClose={() => handleSuccessOkClick()}
        primaryButtonOnClick={() => handleSuccessOkClick()}
      />
    </div>
  );
};

export default KickOffMeetingAndSignOff;

KickOffMeetingAndSignOff.propTypes = {
  location: PropTypes.instanceOf(Object).isRequired,
};
