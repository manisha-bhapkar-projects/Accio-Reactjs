/**
 * ErrorAlert:
 *
 * open:  open popup
 * setClose : function to close popup
 * alertMessage : message in alert box
 * primaryButtonOnClick : function which handel primary button click action
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import './ErrorAlert.scss';
import errorIcon from '../../../../images/alerts/error/error.png';
import AlertBox from '../AlertBox';
import labels from '../../../../utils/Locales/labels';

const ErrorAlert = props => {
  const {
    open,
    setClose,
    alertMessage,
    primaryButtonOnClick,
    primaryButtonText,
    isCancelButton,
    secondaryButtonText,
  } = props;
  return (
    <AlertBox
      open={open}
      title={labels.GLOBAL.ERROR}
      setClose={setClose}
      alertIcon={errorIcon}
      alertMessage={alertMessage}
      isActionButtons
      isCancelButton={isCancelButton}
      isPrimaryButton
      primaryButtonText={primaryButtonText}
      primaryButtonOnClick={primaryButtonOnClick}
      secondaryButtonText={secondaryButtonText}
      type="error"
    />
  );
};

export default ErrorAlert;

ErrorAlert.defaultProps = {
  open: '',
  setClose: '',
  alertMessage: '',
  primaryButtonOnClick: () => {},
  primaryButtonText: 'try again',
  isCancelButton: false,
  secondaryButtonText: '',
};

ErrorAlert.propTypes = {
  open: PropTypes.bool,
  setClose: PropTypes.func,
  alertMessage: PropTypes.string,
  primaryButtonOnClick: PropTypes.func,
  primaryButtonText: PropTypes.string,
  isCancelButton: PropTypes.bool,
  secondaryButtonText: PropTypes.string,
};
