import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import './ButtonWithProgressBar.scss';

const ButtonWithProgressBar = ({
  buttonClassName,
  onClick,
  isLoading,
  buttonText,
  ...rest
}) => {
  return (
    <div className="button-with-progress-bar">
      <button
        onClick={onClick}
        type="button"
        className={buttonClassName}
        disabled={isLoading}
        {...rest}
      >
        {isLoading && (
          <div className="progress-icon">
            <CircularProgress size="25px" />{' '}
          </div>
        )}
        {buttonText}
      </button>
    </div>
  );
};

export default ButtonWithProgressBar;

ButtonWithProgressBar.defaultProps = {
  buttonClassName: 'button-class',
  onClick: () => {},
  isLoading: false,
  buttonText: 'Save and Continue',
};

ButtonWithProgressBar.propTypes = {
  buttonClassName: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  buttonText: PropTypes.string,
};
