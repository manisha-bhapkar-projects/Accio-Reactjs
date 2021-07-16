import React from 'react';
import PropTypes from 'prop-types';
import './TextFieldComponent.scss';

const TextFieldComponent = ({
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
    <div className={`text-field-component ${className}`}>
      {label ? (
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
      ) : (
        ''
      )}
      <input
        id={id}
        className={
          !error
            ? `form-control ${inputClassName}`
            : `form-control error ${inputClassName}`
        }
        disabled={isDisable}
        autoComplete="off"
        {...rest}
      />
      {helperText && error ? (
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

TextFieldComponent.propTypes = {
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

TextFieldComponent.defaultProps = {
  className: '',
  label: '',
  labelClassName: '',
  inputClassName: '',
  error: false,
  helperText: '',
  helperTextClassName: '',
  isDisable: false,
};

export default TextFieldComponent;
