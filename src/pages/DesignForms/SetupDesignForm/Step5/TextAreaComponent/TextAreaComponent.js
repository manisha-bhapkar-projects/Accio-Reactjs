import React from 'react';
import PropTypes from 'prop-types';
import './TextAreaComponent.scss';
import helpIcon from '../../../../../images/help/help.png';
import OverlayToolTip from '../../../../../components/OverlayToolTip/OverlayToolTip';

const TextAreaComponent = ({
  id,
  label,
  className,
  labelClassName,
  inputClassName,
  error,
  helperText,
  helperTextClassName,
  isDisable,
  ...rest
}) => {
  return (
    <div className={`text-area-component ${className}`}>
      {label ? (
        <div className="label-container">
          <label
            htmlFor={id}
            className={
              !error
                ? `input-label ${labelClassName}`
                : `input-label  error ${labelClassName}`
            }
          >
            {label}
          </label>
          <OverlayToolTip position="top" label={label}>
            <img
              src={helpIcon}
              alt=""
              style={{ height: '12px', width: '12px' }}
            />
          </OverlayToolTip>
        </div>
      ) : (
        ''
      )}
      <textarea
        id={id}
        className={
          !error
            ? `text-area-control ${inputClassName}`
            : `text-area-control error ${inputClassName}`
        }
        disabled={isDisable}
        {...rest}
      />
      <div className="content-length">
        <p>0/2000</p>
      </div>
      {helperText ? (
        <small
          className={
            !error
              ? `${helperTextClassName} helper-text`
              : `${helperTextClassName} helper-text error`
          }
        >
          {helperText}
        </small>
      ) : (
        ''
      )}
    </div>
  );
};

TextAreaComponent.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  helperTextClassName: PropTypes.string,
  isDisable: PropTypes.bool,
};

TextAreaComponent.defaultProps = {
  className: '',
  label: '',
  labelClassName: '',
  inputClassName: '',
  error: false,
  helperText: '',
  helperTextClassName: '',
  isDisable: false,
};

export default TextAreaComponent;
