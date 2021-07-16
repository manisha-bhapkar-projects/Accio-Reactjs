import React from 'react';
import PropTypes from 'prop-types';
import './TextAreaComponent.scss';

const TextAreaComponent = ({
  id,
  label,
  className,
  labelClassName,
  inputClassName,
  error,
  rows,
  helperText,
  helperTextClassName,
  isDisable,
  value,
  maxLength,
  isContentLength,
  ...rest
}) => {
  return (
    <div className={`text-area-component ${className}`}>
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
      <textarea
        id={id}
        rows={rows}
        className={
          !error
            ? `form-control ${inputClassName}`
            : `form-control error ${inputClassName}`
        }
        disabled={isDisable}
        autoComplete="off"
        value={value}
        {...rest}
      />
      {isContentLength === true && (
        <div className="content-length pr-0">
          <p>
            {value ? value.length : '0'}/{maxLength}
          </p>
        </div>
      )}

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
  rows: PropTypes.string,
  value: PropTypes.string,
  isContentLength: PropTypes.bool,
  maxLength: PropTypes.number,
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
  rows: '5',
  value: '',
  isContentLength: true,
  maxLength: 500,
};

export default TextAreaComponent;
