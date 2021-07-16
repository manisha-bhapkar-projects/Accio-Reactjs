import React from 'react';
import PropTypes from 'prop-types';
import './CustomTimePicker.scss';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

const CustomTimePicker = ({
  id,
  label,
  className,
  labelClassName,
  inputClassName,
  error,
  helperText,
  helperTextClassName,
  isDisable,
  onChange,
  format,
  showSecond,
  defaultValue,
  use12Hours,
  inputReadOnly,
  ...rest
}) => {
  return (
    <div className={`custome-time-picker-component ${className}`}>
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
      <TimePicker
        showSecond={showSecond}
        defaultValue={defaultValue}
        className={
          !error
            ? `form-controls ${inputClassName}`
            : `form-controls error ${inputClassName}`
        }
        onChange={onChange}
        format={format}
        use12Hours={use12Hours}
        inputReadOnly={inputReadOnly}
        disabled={isDisable}
        {...rest}
      />
      {/* <input
        id={id}
        className={
          !error
            ? `form-control ${inputClassName}`
            : `form-control error ${inputClassName}`
        }
        disabled={isDisable}
        autoComplete="off"
        {...rest}
      /> */}
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

CustomTimePicker.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  helperTextClassName: PropTypes.string,
  isDisable: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  format: PropTypes.string.isRequired,
  showSecond: PropTypes.string,
  defaultValue: PropTypes.string,
  use12Hours: PropTypes.bool,
  inputReadOnly: PropTypes.bool,
};

CustomTimePicker.defaultProps = {
  className: '',
  label: '',
  labelClassName: '',
  inputClassName: '',
  error: false,
  helperText: '',
  helperTextClassName: '',
  isDisable: false,
  showSecond: false,
  defaultValue: '12 : 00 : AM',
  use12Hours: true,
  inputReadOnly: true,
};

export default CustomTimePicker;
