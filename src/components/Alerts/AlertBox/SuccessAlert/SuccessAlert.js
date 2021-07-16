/**
 * SuccessAlert:
 *
 * open:  open popup
 * setClose : function to close popup
 * alertMessage : message in alert box
 * primaryButtonOnClick : function which handel primary button click action
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import './SuccessAlert.scss';
import successIcon from '../../../../images/alerts/success/success.png';
import AlertBox from '../AlertBox';
import labels from '../../../../utils/Locales/labels';

const SuccessAlert = props => {
  const {
    open,
    setClose,
    alertMessage,
    primaryButtonOnClick,
    primaryButtonText,
  } = props;
  return (
    <AlertBox
      open={open}
      title={labels.GLOBAL.SUCCESS}
      setClose={setClose}
      alertIcon={successIcon}
      alertMessage={alertMessage}
      isActionButtons
      isCancelButton={false}
      isPrimaryButton
      primaryButtonText={primaryButtonText}
      primaryButtonOnClick={primaryButtonOnClick}
      type="success"
    />
  );
};

export default SuccessAlert;

SuccessAlert.defaultProps = {
  open: '',
  setClose: '',
  alertMessage: '',
  primaryButtonOnClick: () => {},
  primaryButtonText: 'OK',
};

SuccessAlert.propTypes = {
  open: PropTypes.bool,
  setClose: PropTypes.func,
  alertMessage: PropTypes.string,
  primaryButtonOnClick: PropTypes.func,
  primaryButtonText: PropTypes.string,
};
