/**
 * InformationAlert:
 *
 * open:  open popup
 * setClose : function to close popup
 * alertMessage : message in alert box
 * primaryButtonOnClick : function which handel primary button click action
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import './InformationAlert.scss';
import informationIcon from '../../../../images/alerts/info/information.png';
import AlertBox from '../AlertBox';
import labels from '../../../../utils/Locales/labels';

const InformationAlert = props => {
  const {
    open,
    setClose,
    alertMessage,
    primaryButtonOnClick,
    primaryButtonText,
    secondaryButtonText,
    ...rest
  } = props;
  return (
    <AlertBox
      open={open}
      title={labels.GLOBAL.INFORMATION}
      setClose={setClose}
      alertIcon={informationIcon}
      alertMessage={alertMessage}
      isActionButtons
      isCancelButton
      isPrimaryButton
      primaryButtonText={primaryButtonText}
      primaryButtonOnClick={primaryButtonOnClick}
      secondaryButtonText={secondaryButtonText}
      type="information"
      {...rest}
    />
  );
};

export default InformationAlert;

InformationAlert.defaultProps = {
  open: '',
  setClose: '',
  alertMessage: '',
  primaryButtonOnClick: () => {},
  primaryButtonText: 'Save',
  secondaryButtonText: 'Cancel',
};

InformationAlert.propTypes = {
  open: PropTypes.bool,
  setClose: PropTypes.func,
  alertMessage: PropTypes.string,
  primaryButtonOnClick: PropTypes.func,
  primaryButtonText: PropTypes.string,
  secondaryButtonText: PropTypes.string,
};
