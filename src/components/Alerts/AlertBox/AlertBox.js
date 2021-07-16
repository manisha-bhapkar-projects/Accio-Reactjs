/**
 *   AlertBox:
 */
import React from 'react';
import PropTypes from 'prop-types';
import './AlertBox.scss';
import Popup from '../../Popup/Popup';

/**
 * AlertBox :
 * @param {boolean} open : to open alert box
 * @param {string} title : title of alert box
 * @param {function} setClose : function which close alert box
 * @param {object} children : jsx to render child inside alert box
 * @param {string} alertIcon : icon for alert box
 * @param {string} alertBoxIconClassName : style of alert icon
 * @param {string} alertMessage : alert message for alert
 * @param {boolean} isActionButtons : action button is there or not. If it is true then all buttons are shown
 * @param {boolean} isCancelButton : is cancel button is there if actoin button is true
 * @param {boolean} isPrimaryButton : is primary button is there or not
 * @param {string} primaryButtonText : text which shows in primary button
 * @param {function} primaryButtonOnClick : function which handel click action on primary button
 */

const AlertBox = ({
  open,
  title,
  setClose,
  children,
  alertIcon,
  alertBoxIconClassName,
  alertMessage,
  isActionButtons,
  isCancelButton,
  isPrimaryButton,
  primaryButtonText,
  primaryButtonOnClick,
  secondaryButtonText,
  type, // error, information, success
}) => {
  return (
    <Popup open={open} setClose={setClose} scrollType="body">
      <div className="alert-box">
        {title && (
          <div className="alert-box-title-div">
            <div className={`alert-box-title ${type}`}>{title}</div>
            <div className="alert-box-bottom-border" />
          </div>
        )}
        {alertIcon && (
          <img
            className={alertBoxIconClassName}
            src={alertIcon}
            alt="alert icon"
          />
        )}
        {alertMessage && (
          <>
            <div className="alert-message-label">{alertMessage}</div>
          </>
        )}
        {children && <>{children}</>}
        {isActionButtons && (
          <div className="alert-box-button-container ">
            {isCancelButton && (
              <button onClick={setClose} type="button" className="btn-cancel">
                {secondaryButtonText}
              </button>
            )}
            {isPrimaryButton && (
              <button
                onClick={primaryButtonOnClick}
                type="button"
                className="btn-confirm"
              >
                {primaryButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    </Popup>
  );
};

export default AlertBox;

AlertBox.defaultProps = {
  title: '',
  type:'error',
  open: '',
  setClose: '',
  alertMessage: '',
  alertIcon: '',
  alertBoxIconClassName: 'alert-box-icon',
  children: <></>,
  isActionButtons: false,
  isCancelButton: false,
  isPrimaryButton: false,
  primaryButtonText: 'OK',
  primaryButtonOnClick: () => {},
  secondaryButtonText: 'Cancel',
};

AlertBox.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  open: PropTypes.bool,
  setClose: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
  ]),
  alertMessage: PropTypes.string,
  alertIcon: PropTypes.string,
  alertBoxIconClassName: PropTypes.string,
  isActionButtons: PropTypes.bool,
  isCancelButton: PropTypes.bool,
  isPrimaryButton: PropTypes.bool,
  primaryButtonText: PropTypes.string,
  primaryButtonOnClick: PropTypes.func,
  secondaryButtonText: PropTypes.string,
};
